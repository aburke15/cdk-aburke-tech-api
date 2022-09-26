import { Duration } from 'aws-cdk-lib';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class PortfolioConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const memorySize: number = 240;
    const timeout: Duration = Duration.seconds(30);

    const insertReposFunction: IFunction = new NodejsFunction(this, 'InsertReposFunction', {
      memorySize: 240,
      timeout: Duration.seconds(30),
    });

    const deleteReposFunction: IFunction = new NodejsFunction(this, 'DeleteReposFunction', {});
  }
}
