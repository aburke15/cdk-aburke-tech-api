import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { AburkeTechApiDomain } from './aburke-tech-api-domain';
import { AburkeTechApiEndpoints } from './aburke-tech-api-endpoints';
import { AburkeTechPortfolio } from './aburke-tech-portfolio';

export class AburkeTechApi extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const portfolio = new AburkeTechPortfolio(this, 'AburkeTechPortfolio');

    const api = new RestApi(this, 'AburkeTechApiGateway', {
      restApiName: 'AburkeTechApi',
    });

    new AburkeTechApiEndpoints(this, 'AburkeTechApiEndpoints', {
      api: api,
      getProjectsFunction: portfolio.GetPortfolioProjectsFunction,
    });

    new AburkeTechApiDomain(this, 'AburkeTechApiDomain', {
      api: api,
    });
  }
}
