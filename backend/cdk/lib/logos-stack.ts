import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

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
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'Logos'
    });

    // Lambda function to fetch logos
    const getLogosLambda = new lambda.Function(this, 'GetLogosFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/dist')),
      handler: 'getLogos.handler',
      environment: {
        LOGOS_TABLE_NAME: logosTable.tableName,
        LOGOS_BUCKET_NAME: logosBucket.bucketName
      }
    });

    //Grant access to lambda for DynamoDB and S3 bucket
    logosTable.grantReadData(getLogosLambda);
    logosBucket.grantRead(getLogosLambda);

    // API gateway to expose the Lambda function as a REST API
    const api = new apigateway.RestApi(this, 'LogosApi', {
      restApiName: 'Logos Service',
      description: 'This services fetches football logos'
    });

    const getLogosIntegration = new apigateway.LambdaIntegration(getLogosLambda)
    api.root.addMethod('GET', getLogosIntegration)
  }
}
