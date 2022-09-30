import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi, ResourceOptions } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { CloudResumeConstruct } from './cloud-resume-construct';
import { PortfolioConstruct } from './portfolio-construct';

export class CdkApiAburkeTechStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const portfolio = new PortfolioConstruct(this, 'PortfolioConstruct');
    // const cloudResume = new CloudResumeConstruct(this, 'CloudResumeConstruct');

    const api = new RestApi(this, 'AburkeTechApiGateway', {
      restApiName: 'AburkeTechApi',
    });

    api.root
      .addResource('projects', {
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowMethods: ['GET'],
        },
      })
      .addMethod('GET', new LambdaIntegration(portfolio.GetPortfolioProjectsFunction));
  }
}
