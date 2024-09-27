import { APIGatewayProxyHandler } from 'aws-lambda';
import {DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb';
import {GetObjectCommand, GetObjectCommandInput, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import {Logo} from './models/Logo';
import {createErrorResponse, createSuccessResponse} from './models/Response';
import {transformDynamoDBItem} from './utils/transformDynamoDbItem';

const dynamodbClient = new DynamoDBClient({});
const s3Client = new S3Client({});
const tableName = process.env.LOGOS_TABLE_NAME;
const bucketName = process.env.LOGOS_BUCKET_NAME;

export const handler: APIGatewayProxyHandler = async () => {
  try {
    console.log('Fetching ALL LOGOS');
    const result = await dynamodbClient.send(new ScanCommand({ TableName: tableName }));

    const transformedItems = result.Items?.map(transformDynamoDBItem) || []

    //Fetch signed URLS for the logos stored on S3
    const logos: Logo[] = await Promise.all(
      transformedItems.map(async (item) => {
        const imageKey = item.imageKey;
        if (!imageKey) {
          throw new Error('Image key is missing or invalid');
        }

        const getObjectParams: GetObjectCommandInput = {
          Bucket: bucketName,
          Key: imageKey,
        };

        //Get signed url for each logo from S3
        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand(getObjectParams),
          {expiresIn: 60 * 5}
        )

        return {
          ...item,
          imageUrl: signedUrl
        } as Logo;
      })
    );

    return createSuccessResponse(logos);
  } catch (error) {
    console.log(error);
    return createErrorResponse('Error retrieving logos');
  }
};