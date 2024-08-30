"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const transformDynamoDbItem_1 = require("./utils/transformDynamoDbItem");
const dynamodbClient = new client_dynamodb_1.DynamoDBClient({});
const s3Client = new client_s3_1.S3Client({});
const tableName = process.env.LOGOS_TABLE_NAME;
const bucketName = process.env.LOGOS_BUCKET_NAME;
const handler = async () => {
    try {
        //Logos metadata
        //TODO maybe try out dynamodbDocumentClient?
        const result = await dynamodbClient.send(new client_dynamodb_1.ScanCommand({ TableName: tableName }));
        const transformedItems = result.Items?.map(transformDynamoDbItem_1.transformDynamoDBItem) || [];
        //Fetch signed URLS for the logos stored on S3
        const logos = await Promise.all(transformedItems.map(async (item) => {
            const imageKey = item.imageKey;
            if (!imageKey) {
                throw new Error('Image key is missing or invalid');
            }
            const getObjectParams = {
                Bucket: bucketName,
                Key: imageKey,
            };
            //Get signed url for each logo from S3
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand(getObjectParams), { expiresIn: 60 * 5 });
            return {
                ...item,
                imageUrl: signedUrl
            };
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(logos)
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving logos' }),
        };
    }
};
exports.handler = handler;
