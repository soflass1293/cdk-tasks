const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function ls() {
  const { stdout, stderr } = await exec('cd frontend && npx projen build');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
ls();