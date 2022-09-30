import * as AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';

const apiVersion = { apiVersion: '2012-08-10' };
let ddb = new AWS.DynamoDB(apiVersion);

exports.handler = async (event: APIGatewayEvent) => {
  console.info(JSON.stringify(event, null, 2));

  try {
    if (!ddb) {
      ddb = new AWS.DynamoDB(apiVersion);
    }
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};
