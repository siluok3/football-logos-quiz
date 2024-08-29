## Feed data to dynamo db
```
npx ts-node addLogosToDynamoDB.ts
```

## Deploy the backend to AWS (Dynamo DB, S3 bucket, Api Gateway and Lambdas)
```
npm run cdk-deploy
```
This will first compile all the lambdas from ts to js and put them on the `dist` directory 
and then deploy them to AWS with the **CDK** command `npx cdk deploy`