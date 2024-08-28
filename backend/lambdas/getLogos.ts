import { APIGatewayProxyHandler } from 'aws-lambda';
import {DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb';
import {GetObjectCommand, GetObjectCommandInput, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const dynamodbClient = new DynamoDBClient({});
const s3Client = new S3Client({});
const tableName = process.env.LOGOS_TABLE_NAME;
const bucketName = process.env.LOGOS_BUCKET_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    //Logos metadata
    const result = await dynamodbClient.send(new ScanCommand({ TableName: tableName }));

    //Fetch signed URLS for the logos stored on S3
    const logos = await Promise.all(
      result.Items?.map(async (item) => {
        const imageKey = item.imageKey?.S; //Is image key a string?
        if (!imageKey) {
          throw new Error('Image key is missing or invalid');
        }

        const getObjectParams: GetObjectCommandInput = {
          Bucket: bucketName!,
          Key: imageKey,
        };

        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand(getObjectParams),
          {expiresIn: 60 * 5}
        )

        return {
          ...item,
          imageUrl: signedUrl
        };
      }) || []
    );

    return {
      statusCode: 200,
      body: JSON.stringify(logos)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving logos' }),
    };
  }
};