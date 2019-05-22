const cpx = require('cpx');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const dest = path.join(__dirname, '../build');
const root = path.join(__dirname, '../');

(async () => {
    cpx.copy(`${path.join(root, 'public/**/*')}`, dest);
    const { stdout, stderr} = await exec(`cp ${path.join(root, '.nvmrc')} ${dest}`);
    process.exit(0);
})();