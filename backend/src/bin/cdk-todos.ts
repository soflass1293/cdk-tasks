#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { APIStack, DatabaseStack, EventsStack, WebsiteStack } from "../lib";
import "dotenv/config";

const app = new cdk.App();

const { table, archivedTable } = new DatabaseStack(app, "DatabaseStack", {
  stackName: "cdk-tasks-add-backend-database",
});
new APIStack(app, "APIStack", {
  table,
  archivedTable,
  stackName: "cdk-tasks-add-backend-api",
});
new EventsStack(app, "EventsStack", {
  archivedTable,
  stackName: "cdk-tasks-add-backend-events",
});
if (false) {
  new WebsiteStack(app, "WebsiteStack", {
    stackName: "cdk-tasks-add-backend-website",
  });
}
