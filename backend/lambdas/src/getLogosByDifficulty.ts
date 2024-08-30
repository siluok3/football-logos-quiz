import {APIGatewayProxyHandler} from 'aws-lambda';
import {DynamoDBClient, QueryCommand, QueryCommandInput} from '@aws-sdk/client-dynamodb';
import {GetObjectCommand, GetObjectCommandInput, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import {Logo} from './models/Logo';
import {transformDynamoDBItem} from './utils/transformDynamoDbItem';
import {createErrorResponse, createSuccessResponse} from './models/Response';

const dynamodbClient = new DynamoDBClient({});
const s3Client = new S3Client({})
const tableName = process.env.LOGOS_TABLE_NAME;
const bucketName = process.env.LOGOS_BUCKET_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const difficulty = event.queryStringParameters?.difficulty;
    if (!difficulty) {
      return createErrorResponse('Difficulty parameter is required', 400);
    }

    const queryParams: QueryCommandInput = {
      TableName: tableName,
      IndexName: 'DifficultyIndex',
      KeyConditionExpression: 'difficulty = :difficulty',
      ExpressionAttributeValues: {
        ':difficulty': { S: difficulty },
      }
    };

    const result = await dynamodbClient.send(new QueryCommand(queryParams));

    const transformedItems = result.Items?.map(transformDynamoDBItem) || [];

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

        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand(getObjectParams),
          {expiresIn: 60 * 5}
        );

        return {
          ...item,
          imageUrl: signedUrl
        } as Logo;
      })
    );

    return createSuccessResponse(logos);
  } catch (error) {
    console.log(error);
    return createErrorResponse('Error retrieving logos by difficulty');
  }
}