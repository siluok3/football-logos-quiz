## Deploy the backend to AWS (Dynamo DB, S3 bucket, Api Gateway and Lambdas)
```
npm run cdk-deploy
```
This will first compile all the lambdas from ts to js and put them on the `dist` directory 
and then deploy them to AWS with the **CDK** command `npx cdk deploy`


## Add logos to S3 bucket
```
aws s3 cp {logosDir} s3://football-logos-quiz-bucket/ --recursive
```

## Feed data to dynamo db
```
npx ts-node addLogosToDynamoDB.ts
```
Before running the script update the `logos` constant with the entries you would like
to upload and keep the `imagekey` with the same name with the logo was uploaded to the
S3 bucket (for instance `barcelona.png` should be the `imagekey` and the png 
name upload to S3)