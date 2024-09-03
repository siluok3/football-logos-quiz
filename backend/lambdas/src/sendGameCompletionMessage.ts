import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {createErrorResponse, createSuccessResponse} from './models/Response';

const LOG_QUEUE_URL = process.env.LOG_QUEUE_URL || '';
const sqsClient = new SQSClient({});

interface GameCompletionMessage {
  userId: string;
  completionTime: string;
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent ): Promise<APIGatewayProxyResult> => {
  try {
    const { userId, completionTime } = JSON.parse(event.body || '{}') as GameCompletionMessage;

    if (!userId || !completionTime) {
      return createErrorResponse('userId and completionTime are required', 400);
    }

    const params = {
      MessageBody: JSON.stringify({ userId, completionTime }),
      QueueUrl: LOG_QUEUE_URL
    };

    const command = new SendMessageCommand(params);
    await sqsClient.send(command);
    console.log('Game completion message sent to SQS');

    return createSuccessResponse({ messageSent: true })
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    return createErrorResponse('Failed to send message');
  }
};