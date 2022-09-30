import { Duration } from 'aws-cdk-lib';
import { Code, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct, Node } from 'constructs';
import * as Options from './common/options';
import * as DDB from 'aws-cdk-lib/aws-dynamodb';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class PortfolioConstruct extends Construct {
  // private members that can be shared across functions
  private readonly memorySize: number = 256;
  private readonly timeout: Duration = Duration.seconds(30);

  // public exposed functions to be added to the api gateway
  public readonly GetPortfolioProjectsFunction: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // pull in the github repo table arn from secrets manager
    const tableSecret = Secret.fromSecretNameV2(this, 'ApiGitHubRepoTableArnSecret', 'ApiGitHubRepoTableArn');
    const tableArn = tableSecret?.secretValue?.unsafeUnwrap()?.toString();
    const table = DDB.Table.fromTableArn(this, 'ApiGitHubRepoTable', tableArn);

    this.GetPortfolioProjectsFunction = new NodejsFunction(this, 'GetPortfolioProjectsFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: this.memorySize,
      timeout: this.timeout,
      entry: Code.fromAsset(Options.AssetDirectory).path + '/get-portfolio-projects-function.ts',
      handler: Options.HandlerName,
      bundling: Options.BundlingOptions,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadData(this.GetPortfolioProjectsFunction);
  }
}
