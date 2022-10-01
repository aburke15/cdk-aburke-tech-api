import { Duration } from 'aws-cdk-lib';
import { Code, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as Options from './common/options';

export class AburkeTechCloudResume extends Construct {
  // private members to be used across funcs in this class
  private readonly memorySize: number = 128;
  private readonly timeout: Duration = Duration.seconds(30);

  // expose this function to be referenced outside of this class
  public readonly GetIncrementedPageVisitCount: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const getPageVistCountFunction: IFunction = new NodejsFunction(this, 'GetPageVisitCountFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: this.memorySize,
      timeout: this.timeout,
      entry: Code.fromAsset(Options.AssetDirectory).path + '/get-page-visit-count-function.ts',
      handler: Options.HandlerName,
      bundling: Options.BundlingOptions,
      environment: {
        // table name
      },
    });

    this.GetIncrementedPageVisitCount = new NodejsFunction(this, 'IncrementPageVisitCountFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: this.memorySize,
      timeout: this.timeout,
      entry: Code.fromAsset(Options.AssetDirectory).path + '/increment-page-visit-count-function.ts',
      handler: Options.HandlerName,
      bundling: Options.BundlingOptions,
      environment: {
        // table name
        // downstream function name
      },
    });

    getPageVistCountFunction.grantInvoke(this.GetIncrementedPageVisitCount);
  }
}
