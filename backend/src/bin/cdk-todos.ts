#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { APIStack, DatabaseStack, EventsStack, WebsiteStack } from "../lib";
import "dotenv/config";

const app = new cdk.App();

const { table, archivedTable } = new DatabaseStack(app, "DatabaseStack");
new APIStack(app, "APIStack", {
  table,
  archivedTable,
});
new EventsStack(app, "EventsStack", { archivedTable });
new WebsiteStack(app, "WebsiteStack");