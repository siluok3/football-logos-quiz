#!/usr/bin/env node
// import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LogosStack } from '../lib/logos-stack';

const app = new cdk.App();

const targetEnv = process.env.DEPLOY_ENV || 'dev';

if (targetEnv === 'dev') {
  new LogosStack(app, 'LogosStack-Dev', {
    envPrefix: 'dev',
  });
} else if (targetEnv === 'prod') {
  new LogosStack(app, 'LogosStack-Prod', {
    envPrefix: 'prod',
  });
} else {
  console.log('No target environment was provided! Should be `dev` or `prod`')
}
