import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { TodoDeletedEvent } from "./records";

type EventStackProps = cdk.StackProps & {
  archivedTable: dynamodb.Table;
};

export class EventsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EventStackProps) {
    super(scope, id, props);

    const fnArchiveTodoWorker = new NodejsFunction(this, "AppArchiveTodoWorker", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: join(__dirname, "workers", "archive-todo.ts"),
      handler: "handler",
      environment: {
        APP_ARCHIVED_TABLE: props.archivedTable.tableName
      }
    });
    props.archivedTable.grantWriteData(fnArchiveTodoWorker)

    const deletedTodo = "TODO_DELETED" as TodoDeletedEvent["eventName"];
    const source = process.env.EVENT_SOURCE as string
    const rule = new events.Rule(this, "AppEventBridgeRule", {
      eventPattern: {
        source: [source],
        detailType: [deletedTodo],
      },
    });

    rule.addTarget(new targets.LambdaFunction(fnArchiveTodoWorker));
  }
}
