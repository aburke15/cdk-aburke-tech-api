import * as AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import * as Options from '../lib/common/options';
import { GitHubProject } from '../lib/common/types';

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
    const projects = toGitHubProjects(data?.Items);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(projects, null, 2),
    };
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return {
      statusCode: 400,
    };
  }
};

const getProjects = (ddb: AWS.DynamoDB) => {
  const tableName: string = process.env.TABLE_NAME!;
  const params: AWS.DynamoDB.ScanInput = {
    TableName: tableName,
  };

  return ddb.scan(params).promise();
};

const toGitHubProjects = (itemList?: AWS.DynamoDB.ItemList): GitHubProject[] => {
  let projects: GitHubProject[] = [];
  if (!itemList) {
    return projects;
  }

  itemList.forEach((item) => {
    projects.push({
      id: item.id.S,
      name: item.name.S,
      createdAt: item.createdAt.S,
      description: item.description.S,
      htmlUrl: item.htmlUrl.S,
      language: item.language.S,
    } as GitHubProject);
  });

  return projects;
};
