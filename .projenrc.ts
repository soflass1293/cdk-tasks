import { typescript } from "projen";
import { monorepo } from "@aws/pdk";
const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "cdk-tasks",
  projenrcTs: true,
});
const frontend = new typescript.TypeScriptAppProject({
  name: "frontend",
  defaultReleaseBranch: "main",
  deps: ["alpinejs"],
  devDeps: ["vite", "@types/alpinejs", "@types/web"],
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
