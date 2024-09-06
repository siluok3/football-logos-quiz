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
    const country = event.queryStringParameters?.country;
    if (!difficulty && !country) {
      return createErrorResponse('At least one parameter (difficulty or country) is required', 400);
    }

    const queryParams: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: '',
      ExpressionAttributeValues: {
        ':enabled': { BOOL: true}
      },
      FilterExpression: 'enabled = :enabled'
    };

    //TODO more dynamic in case we want to add more conditions
    if (difficulty && country) {
      queryParams.IndexName = 'DifficultyIndex';
      queryParams.KeyConditionExpression = 'difficulty = :difficulty';
      queryParams.ExpressionAttributeValues![':difficulty'] = { S: difficulty };

      queryParams.FilterExpression += ' AND country = :country';
      queryParams.ExpressionAttributeValues![':country'] = { S: country };
    } else if (difficulty) {
      queryParams.IndexName = 'DifficultyIndex';
      queryParams.KeyConditionExpression = 'difficulty = :difficulty';
      queryParams.ExpressionAttributeValues![':difficulty'] = { S: difficulty };
    } else if (country) {
      queryParams.IndexName = 'CountryIndex';
      queryParams.KeyConditionExpression = 'country = :country';
      queryParams.ExpressionAttributeValues![':country'] = { S: country };
    }

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
    return createErrorResponse('Error retrieving logos by search term');
  }
}