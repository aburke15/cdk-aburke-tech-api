import { Duration } from 'aws-cdk-lib';
import { Code, IFunction } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct, Node } from 'constructs';

export class PortfolioConstruct extends Construct {
  // private members that can be shared across functions
  private readonly memorySize: number = 256;
  private readonly timeout: Duration = Duration.seconds(30);

  // public exposed functions to be added to the api gateway
  public readonly GetPortfolioProjectsFunction: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const getPortfolioProjectsFunction: IFunction = new NodejsFunction(this, 'GetPortfolioProjectsFunction', {
      memorySize: this.memorySize,
      timeout: this.timeout,
      entry: Code.fromAsset('').path + '/get-portfolio-projects-function.ts',
      bundling: {
        minify: true,
      },
    });

    this.GetPortfolioProjectsFunction = getPortfolioProjectsFunction;
  }
}
