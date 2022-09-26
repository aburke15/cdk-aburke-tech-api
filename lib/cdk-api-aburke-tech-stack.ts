import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkApiAburkeTechStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkApiAburkeTechQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // TODO: add an api gateway

    /*
      TODO: add 2 lambda functions
      - 1 for getting github repos
      - 2 for getting the page count of my aws cloud resume challenge
    */
  }
}
