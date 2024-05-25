import { monorepo } from "@aws/pdk";
const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "cdk-tasks",
  projenrcTs: true,
});
project.synth();