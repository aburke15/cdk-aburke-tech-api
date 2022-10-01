import { Duration } from 'aws-cdk-lib';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as Options from './common/options';
import * as DDB from 'aws-cdk-lib/aws-dynamodb';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class AburkeTechPortfolio extends Construct {
  // private members that can be shared across functions
  private readonly memorySize: number = 256;
  private readonly timeout: Duration = Duration.seconds(30);

  // public exposed functions to be added to the api gateway
  public readonly GetPortfolioProjectsFunction: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // pull in the github repo table arn from secrets manager
    const tableSecret = Secret.fromSecretNameV2(this, 'GitHubRepoTableNameSecret', 'GitHubRepoTableName');
    const tableName = tableSecret?.secretValue?.unsafeUnwrap()?.toString();
    const table = DDB.Table.fromTableName(this, 'GitHubRepoTable', tableName);

    this.GetPortfolioProjectsFunction = new NodejsFunction(this, 'GetPortfolioProjectsFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: this.memorySize,
      timeout: this.timeout,
      handler: Options.HandlerName,
      entry: Code.fromAsset(Options.AssetDirectory).path + '/get-portfolio-projects-function.ts',
      bundling: Options.BundlingOptions,
      environment: {
        TABLE_NAME: tableName,
      },
    });

    table.grantReadData(this.GetPortfolioProjectsFunction);
  }
}
