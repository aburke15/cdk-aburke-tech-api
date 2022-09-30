import * as AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import * as Options from '../lib/common/options';

AWS.config.update(Options.DefaultRegion);

let ddb = new AWS.DynamoDB(Options.ApiVersion);

const headers = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
} as const;

exports.hander = async (event: APIGatewayEvent) => {
  console.info(JSON.stringify(event, null, 2));

  try {
    if (!ddb) {
      ddb = new AWS.DynamoDB(Options.ApiVersion);
    }

    const data = await getProjects(ddb);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data.Items, null, 2),
    };
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};

const getProjects = (ddb: AWS.DynamoDB) => {
  const tableName: string = process.env.TABLE_NAME!;
  const params: AWS.DynamoDB.ScanInput = {
    TableName: tableName,
  };

  return ddb.scan(params).promise();
};
