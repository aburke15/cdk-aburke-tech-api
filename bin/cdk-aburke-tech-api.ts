#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAburkeTechApiStack } from '../lib/cdk-aburke-tech-api-stack';

const app = new cdk.App();
new CdkAburkeTechApiStack(app, 'CdkAburkeTechApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
