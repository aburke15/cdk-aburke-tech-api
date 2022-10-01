import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface AburkeTechApiEndpointProps {
  api: RestApi;
  getProjectsFunction: IFunction;
}

export class AburkeTechApiEndpoints extends Construct {
  constructor(scope: Construct, id: string, props: AburkeTechApiEndpointProps) {
    super(scope, id);

    // GitHub projects endpoint
    props.api.root
      .addResource('projects', {
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowMethods: ['GET'],
        },
      })
      .addMethod('GET', new LambdaIntegration(props.getProjectsFunction));
  }
}
