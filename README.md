# Football Logos Quiz App
A mobile application that lets you guess logos from different football teams

it is developed on the frontend with `React Native` and on the backend it is using
`AWS lambdas` together with `DynamoDb`, `S3 Bucket` and `API Gateway`

Backend is deployed to AWS and the frontend is using expo.

## Deploy backend
Just execute the command on the root directory
```
npm run deploy:backend
```
This will deploy all the backend resources to AWS
- Lambdas
- Dynamo DB
- S3 bucket
- API Gateway endpoints

## Install dependencies
Just execute the commands on the root directory
```
npm run install:frontend
npm runinstall:backend
```

## Test the application on a real device
Download the Expo Go application on your mobile device and follow the instructions
on how to run the application on your mobile. To start serving the frontend
execute
```
npm run start:frontend
```