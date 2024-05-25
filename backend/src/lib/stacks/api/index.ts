import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { EventBus } from "aws-cdk-lib/aws-events";

type APIStackProps = cdk.StackProps & {
  table: dynamodb.Table;
  archivedTable: dynamodb.Table;
};

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "AppGraphQLAPI", {
      name: "app-graphql-api",
      schema: appsync.SchemaFile.fromAsset(
        join(__dirname, "./schema/schema.graphql")
      ),
    });

    api.addDynamoDbDataSource("appsync-todos-table", props.table);

    const fnCreateTodo = new NodejsFunction(this, "AppFunctionCreateTodo", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: join(__dirname, "resolvers", "create-todo.ts"),
      handler: "handler",
      environment: {
        APP_TABLE: props.table.tableName
      }
    });
    props.table.grantReadWriteData(fnCreateTodo)
    const dsCreateTodo = api.addLambdaDataSource(
      "AppFunctionCreateTodo",
      fnCreateTodo
    );
    dsCreateTodo.createResolver("AppResolverFunctionCreateTodo", {
      typeName: "Mutation",
      fieldName: "createTodo",
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        join(__dirname, "./response.vtl")
      ),
    });

    const fnGetTodos = new NodejsFunction(this, "AppFunctionGetTodos", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: join(__dirname, "resolvers", "get-todos.ts"),
      handler: "handler",
      environment: {
        APP_TABLE: props.table.tableName
      }
    });
    props.table.grantReadData(fnGetTodos)
    const dsGetTodos = api.addLambdaDataSource(
      "AppFunctionGetTodos",
      fnGetTodos
    );
    dsGetTodos.createResolver("AppResolverFunctionGetTodos", {
      typeName: "Query",
      fieldName: "getTodos",
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        join(__dirname, "./response.vtl")
      ),
    });

    const fnToggleCompleted = new NodejsFunction(this, "AppFunctionToggleCompleted", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: join(__dirname, "resolvers", "toggle-completed.ts"),
      handler: "handler",
      environment: {
        APP_TABLE: props.table.tableName
      }
    });
    props.table.grantReadWriteData(fnToggleCompleted)
    const dsToggleCompleted = api.addLambdaDataSource(
      "AppFunctionToggleCompleted",
      fnToggleCompleted
    );
    dsToggleCompleted.createResolver("AppResolverFunctionToggleCompleted", {
      typeName: "Mutation",
      fieldName: "toggleCompleted",
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        join(__dirname, "./response.vtl")
      ),
    });

    const fnDeleteTodo = new NodejsFunction(this, "AppFunctionDeleteTodo", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: join(__dirname, "resolvers", "delete-todo.ts"),
      handler: "handler",
      environment: {
        APP_TABLE: props.table.tableName
      }
    });
    props.table.grantReadWriteData(fnDeleteTodo)
    const bus = EventBus.fromEventBusName(this,"default-bus","default")
    bus.grantPutEventsTo(fnDeleteTodo)
    const dsDeleteTodo = api.addLambdaDataSource(
      "AppFunctionDeleteTodo",
      fnDeleteTodo
    );
    dsDeleteTodo.createResolver("AppResolverFunctionDeleteTodo", {
      typeName: "Mutation",
      fieldName: "deleteTodo",
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        join(__dirname, "./response.vtl")
      ),
    });

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });
  }
}
