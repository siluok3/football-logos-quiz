## Copy logos to S3 bucket 
```
aws s3 cp ./assets/logos s3://<s3-bucket-name>/ --recursive
```

## Deploy frontend to Expo
```
npm install -g eas-cli
eas update --auto --message "Triggered manually from local environment"
```