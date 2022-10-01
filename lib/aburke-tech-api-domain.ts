import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { PublicHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import * as Options from './common/options';

interface AburkeTechApiDomainProps {
  api: RestApi;
}

export class AburkeTechApiDomain extends Construct {
  constructor(scope: Construct, id: string, props: AburkeTechApiDomainProps) {
    super(scope, id);

    const zoneSecret = Secret.fromSecretNameV2(this, `AburkeTechHostedZoneIdSecret`, `AburkeTechHostedZoneId`);
    const certSecret = Secret.fromSecretNameV2(this, `AburkeTechCertificateArnSecret`, `AburkeTechCertificateArn`);

    const zoneId: string = zoneSecret?.secretValue?.unsafeUnwrap()?.toString();
    const certArn: string = certSecret?.secretValue?.unsafeUnwrap()?.toString();

    const cert = Certificate.fromCertificateArn(this, 'AburkeTechApiCertificate', certArn);

    const zone = PublicHostedZone.fromPublicHostedZoneAttributes(this, 'AburkeTechApiZone', {
      hostedZoneId: zoneId,
      zoneName: Options.DomainName,
    });

    props.api.addDomainName('AburkeTechApiDomainName', {
      domainName: `${Options.SubDomain}.${Options.DomainName}`,
      certificate: cert,
    });

    new ARecord(this, 'AburkeTechApiARecord', {
      zone: zone,
      target: RecordTarget.fromAlias(new ApiGateway(props.api)),
      recordName: Options.SubDomain,
    });
  }
}
