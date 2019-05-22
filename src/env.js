var fs = require('fs');

function readWriteSync() {
  let env = process.env.ENV;
  if (!process.env.ENV) {
    env = 'IN';  //SETTING DEFAULT ENV AS DEV
  }
  var data = fs.readFileSync(`src/envs/env.${env}.ts`, 'utf-8');
  fs.writeFileSync('src/envs/env.ts', data, 'utf-8');
  console.log('readFileSync of ENV complete');
}

readWriteSync();
