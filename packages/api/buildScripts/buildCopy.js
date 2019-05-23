const cpx = require('cpx');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const dest = path.join(__dirname, '../build');
const root = path.join(__dirname, '../');
const copy = util.promisify(cpx.copy);
console.log(cpx);
(async () => {
    try {
        await copy(`${path.join(root, 'public/**/*')}`, `${dest}/public`);
        await copy(`${path.join(root, 'src/**/*.graphql')}`, path.join(`${dest}/src`));
        const { stdout, stderr} = await exec(`cp ${path.join(root, '.nvmrc')} ${dest}`);
        // console
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

})();