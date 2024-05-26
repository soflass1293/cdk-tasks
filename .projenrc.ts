import { typescript, awscdk, javascript } from "projen";
import { monorepo } from "@aws/pdk";
const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "cdk-tasks",
  projenrcTs: true,
  packageManager: javascript.NodePackageManager.NPM,
});
const backend = new awscdk.AwsCdkTypeScriptApp({
  name: "backend",
  defaultReleaseBranch: "main",
  cdkVersion: "2.142.1",
  parent: project,
  outdir: "backend",
  appEntrypoint: "bin/cdk-todos.ts",
  devDeps: [
    "@graphql-codegen/add",
    "@graphql-codegen/cli",
    "@graphql-codegen/typescript",
  ],
  deps: [
    "@aws-amplify/graphql-api-construct",
    "@aws-cdk/aws-lambda-nodejs",
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/client-eventbridge",
    "@aws-sdk/lib-dynamodb",
    "@types/aws-lambda",
    "dotenv",
    "source-map-support",
    "uuid",
  ],
  packageManager: javascript.NodePackageManager.NPM,
});
const frontend = new typescript.TypeScriptAppProject({
  name: "frontend",
  defaultReleaseBranch: "main",
  deps: ["alpinejs", "@apollo/client", "graphql"],
  devDeps: ["vite", "@types/alpinejs", "@types/web"],
  outdir: "frontend",
  parent: project,
  packageManager: javascript.NodePackageManager.NPM,
});
backend.addTask("appsync:codegen", {
  exec: "graphql-codegen -c src/lib/stacks/api/codegen.yml",
});
frontend.addTask("dev", {
  exec: "vite",
});
project.addTask("dev", {
  exec: "APP_STAGE=dev npx projen run-many --all --targets=dev",
});
project.addTask("deploy", {
  exec: "cd backend && npx projen deploy --all --verbose --require-approval never",
});
project.synth();
