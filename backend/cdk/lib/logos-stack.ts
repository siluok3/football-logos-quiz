import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as path from 'path';

export class LogosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for Logo Images
    const logosBucket = new s3.Bucket(this, 'LogosBucket', {
      bucketName: 'football-logos-quiz-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // DynamoDB Table for Logo Metadata
    const logosTable = new dynamodb.Table(this, 'LogosTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'Logos'
    });
    // Add secondary index for `difficulty`
    logosTable.addGlobalSecondaryIndex({
      indexName: 'DifficultyIndex',
      partitionKey: { name: 'difficulty', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL
    })
    // Add secondary index for `country`
    logosTable.addGlobalSecondaryIndex({
      indexName: 'CountryIndex',
      partitionKey: { name: 'country', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // SQS Queues
    const logQueue = new sqs.Queue(this, 'LogQueue', {
      queueName: 'GameCompletionQueue',
      retentionPeriod: cdk.Duration.days(4),
    });


    // Lambdas
    // Lambda function to fetch logos
    const getLogosLambda = new lambda.Function(this, 'GetLogosFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/dist')),
      handler: 'getLogos.handler',
      environment: {
        LOGOS_TABLE_NAME: logosTable.tableName,
        LOGOS_BUCKET_NAME: logosBucket.bucketName
      },
      timeout: cdk.Duration.seconds(15),
    });

    // Grant access to getLogos lambda for DynamoDB and S3 bucket
    logosTable.grantReadData(getLogosLambda);
    logosBucket.grantRead(getLogosLambda);

    // Lambda function to fetch logos by search term
    const getLogosBySearchTermLambda = new lambda.Function(this, 'GetLogosBySearchTermFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/dist')),
      handler: 'getLogosBySearchTerm.handler',
      environment: {
        LOGOS_TABLE_NAME: logosTable.tableName,
        LOGOS_BUCKET_NAME: logosBucket.bucketName
      }
    });

    // Grant access to getLogosByDifficulty lambda for DynamoDB and S3 bucket
    logosTable.grantReadData(getLogosBySearchTermLambda);
    logosBucket.grantRead(getLogosBySearchTermLambda);

    // Additional permissions for accessing the DifficultyIndex
    getLogosBySearchTermLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:Query'],
      resources: [
        logosTable.tableArn,
        `${logosTable.tableArn}/index/DifficultyIndex`,
        `${logosTable.tableArn}/index/CountryIndex`
      ],
    }));

    // Lambda to send game Completion SQS messages
    const sendGameCompletionMessageLambda = new lambda.Function(this, 'SendGameCompletionMessageFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/dist')),
      handler: 'sendGameCompletionMessage.handler',
      environment: {
        LOG_QUEUE_URL: logQueue.queueUrl,
      }
    });

    // Grant access to send log messages
    logQueue.grantSendMessages(sendGameCompletionMessageLambda);

    // API Gateway endpoints
    const api = new apigateway.RestApi(this, 'LogosApi', {
      restApiName: 'Logos Service',
      description: 'This services fetches football logos'
    });

    const getLogosIntegration = new apigateway.LambdaIntegration(getLogosLambda);
    const logosResource = api.root.addResource('logos');
    logosResource.addMethod('GET', getLogosIntegration);

    const getLogosBySearchTermIntegration = new apigateway.LambdaIntegration(getLogosBySearchTermLambda);
    const logosByResource = api.root.addResource('logosBy');
    logosByResource.addMethod('GET', getLogosBySearchTermIntegration);

    const sendGameCompletionIntegration = new apigateway.LambdaIntegration(sendGameCompletionMessageLambda);
    const gameCompletionResource = api.root.addResource('sendGameCompletion');
    gameCompletionResource.addMethod('POST', sendGameCompletionIntegration);
  }
}
