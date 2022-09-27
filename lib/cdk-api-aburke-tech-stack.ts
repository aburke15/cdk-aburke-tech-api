import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, LambdaRestApi, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { CloudResumeConstruct } from './cloud-resume-construct';
import { PortfolioConstruct } from './portfolio-construct';

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
    const portfolio = new PortfolioConstruct(this, 'PortfolioConstruct');
    const cloudResume = new CloudResumeConstruct(this, 'CloudResumeConstruct');

    const api = new RestApi(this, '', {
      restApiName: '',
      cloudWatchRole: false,
    });

    const cloudResumeResourceOptions: ResourceOptions = {
      defaultIntegration: new LambdaIntegration(cloudResume.GetIncrementedPageVisitCount),
    };

    api.root.addResource('projects', {});
  }
}
