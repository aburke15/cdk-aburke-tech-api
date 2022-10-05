import { Duration } from 'aws-cdk-lib';
import { Code, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import * as DDB from 'aws-cdk-lib/aws-dynamodb';
import * as Options from './common/options';

export class AburkeTechCloudResume extends Construct {
  // private members to be used across funcs in this class
  private readonly memorySize: number = 128;
  private readonly timeout: Duration = Duration.seconds(30);

  // expose this function to be referenced outside of this class
  public readonly GetIncrementedPageVisitCount: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table: DDB.ITable = this.getDynamoDBTable();
    const tableName: string = table.tableName;

    const getPageVistCountFunction: IFunction = new NodejsFunction(this, 'GetPageVisitCountFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: this.memorySize,
      timeout: this.timeout,
      entry: Code.fromAsset(Options.AssetDirectory).path + '/get-page-visit-count-function.ts',
      handler: Options.HandlerName,
      bundling: Options.BundlingOptions,
      environment: {
        TABLE_NAME: tableName,
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
        TABLE_NAME: tableName,
        DOWNSTREAM_FUNCTION_NAME: getPageVistCountFunction.functionName,
      },
    });

    getPageVistCountFunction.grantInvoke(this.GetIncrementedPageVisitCount);
    table.grantReadData(getPageVistCountFunction);
    table.grantReadWriteData(this.GetIncrementedPageVisitCount);
  }

  private getDynamoDBTable(): DDB.ITable {
    // get table name secret
    const tableNameSecret = Secret.fromSecretNameV2(this, '', '');
    // get table by table name
    const tableName = tableNameSecret?.secretValue?.unsafeUnwrap()?.toString();
    // return table name
    const table = DDB.Table.fromTableName(this, '', tableName);

    return table;
  }
}
