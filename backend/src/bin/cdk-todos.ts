#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { APIStack, DatabaseStack, EventsStack, WebsiteStack } from '../lib';
import 'dotenv/config';

const stage = process.env.STAGE;

const app = new cdk.App();

const { table, archivedTable } = new DatabaseStack(app, 'DatabaseStack', {
  stackName: `database-${stage}`,
});
const api = new APIStack(app, 'APIStack', {
  table,
  archivedTable,
  stackName: `api-${stage}`,
});
new EventsStack(app, 'EventsStack', {
  archivedTable,
  stackName: `events-${stage}`,
});
new WebsiteStack(app, 'WebsiteStack', {
  stackName: `website-${stage}`,
  graphqlUrl: api.graphqlUrl,
  apiKey: api.apiKey,
}).addDependency(api);
