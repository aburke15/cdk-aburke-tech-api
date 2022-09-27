#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkApiAburkeTechStack } from '../lib/cdk-api-aburke-tech-stack';

const app = new cdk.App();
new CdkApiAburkeTechStack(app, 'CdkApiAburkeTechStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
