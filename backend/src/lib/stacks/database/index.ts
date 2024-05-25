import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';

import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  readonly table: dynamodb.Table;
  readonly archivedTable: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //creates a DDB table
    this.table = new dynamodb.Table(this, 'AppTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.archivedTable = new dynamodb.Table(this, 'AppArchivedTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
