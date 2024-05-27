#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { APIStack, DatabaseStack, EventsStack, WebsiteStack } from "../lib";
import "dotenv/config";
import { genstr } from "../lib/utils/rand-str";

function createStackName(stackName: string) {
  const stage = process.env.STAGE || "ephemeral";
  const app_name = process.env.MY_APP || "tasks";
  return `${app_name}-${stackName}-${stage}-a`;
}

const app = new cdk.App();

const { table, archivedTable } = new DatabaseStack(app, "DatabaseStack", {
  stackName: createStackName("database"),
});
const api = new APIStack(app, "APIStack", {
  table,
  archivedTable,
  stackName: createStackName("api"),
});
new EventsStack(app, "EventsStack", {
  archivedTable,
  stackName: createStackName("events"),
});
new WebsiteStack(app, "WebsiteStack", {
  stackName: createStackName("website"),
  graphqlUrl: api.graphqlUrl,
  apiKey: api.apiKey,
});
