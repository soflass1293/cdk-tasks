import { join } from "path";
import * as cdk from "aws-cdk-lib";
import { BundlingFileAccess, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { genstr } from "../../utils/rand-str";

type WebsiteStackProps = cdk.StackProps & {
  graphqlUrl: string | null;
  apiKey: string | undefined;
};

export class WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: WebsiteStackProps) {
    super(scope, id, props);

    const hostingBucket = new Bucket(this, "AppWebsiteHostingBucket", {
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const distribution = new Distribution(this, "AppCloudfrontDistribution", {
      defaultBehavior: {
        origin: new S3Origin(hostingBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    const asset = "../../../../frontend";
    new BucketDeployment(this, "AppWebsiteDeploymentBucket", {
      sources: [
        Source.asset(join(__dirname, asset), {
          bundling: {
            bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
            image: cdk.DockerImage.fromBuild(join(__dirname, "./Dockerfile")),
            environment: {
              VITE_API_HOST: props?.graphqlUrl!,
              VITE_API_KEY: props?.apiKey!,
            },
          },
        }),
      ],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, "AppCloudFrontURL", {
      value: distribution.domainName,
      description: "The distribution URL",
      exportName: `${props?.stackName}-${genstr(5)}-AppCloudFrontURL`,
    });

    new CfnOutput(this, "AppBucketName", {
      value: hostingBucket.bucketName,
      description: "The name of the S3 bucket",
      exportName: `${props?.stackName}-${genstr(5)}-AppBucketName`,
    });
  }
}
