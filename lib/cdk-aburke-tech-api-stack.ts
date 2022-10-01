import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AburkeTechApi } from './aburke-tech-api';

export class CdkAburkeTechApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AburkeTechApi(this, 'AburkeTechApi');
  }
}
