import { typescript, awscdk } from "projen";
import { monorepo } from "@aws/pdk";
const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "cdk-tasks",
  projenrcTs: true,
});
new awscdk.AwsCdkTypeScriptApp({
  name: "backend",
  defaultReleaseBranch: "main",
  cdkVersion: "2.142.1",
  parent: project,
  outdir: "backend",
})
const frontend = new typescript.TypeScriptAppProject({
  name: "frontend",
  defaultReleaseBranch: "main",
  deps: ["alpinejs", "@apollo/client", "graphql"],
  devDeps: ["vite", "@types/alpinejs",'@types/web'],
  outdir: "frontend",
  parent: project,
});
frontend.addTask("dev", {
  exec: "vite",
});
project.addTask("dev", {
  exec: "APP_STAGE=dev npx projen run-many --all --targets=dev",
});
project.synth();
