import { Duration } from 'aws-cdk-lib';
import { Code, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct, Node } from 'constructs';
import * as Options from './common/options';

export class PortfolioConstruct extends Construct {
  // private members that can be shared across functions
  private readonly memorySize: number = 256;
  private readonly timeout: Duration = Duration.seconds(30);

  // public exposed functions to be added to the api gateway
  public readonly GetPortfolioProjectsFunction: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const getPortfolioProjectsFunction: IFunction = new NodejsFunction(this, 'GetPortfolioProjectsFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: this.memorySize,
      timeout: this.timeout,
      entry: Code.fromAsset(Options.AssetDirectory).path + '/get-portfolio-projects-function.ts',
      handler: Options.HandlerName,
      bundling: Options.BundlingOptions,
      environment: {},
    });

    this.GetPortfolioProjectsFunction = getPortfolioProjectsFunction;
  }
}
