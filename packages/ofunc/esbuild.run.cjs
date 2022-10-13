const path = require('path');
const { build } = require('esbuild');
const { dependencies = {}, peerDependencies = {} } = require('./package.json');

const entryPoints = path.resolve(__dirname, './src/index.ts');
const outfile = path.resolve(__dirname, 'dist/index.js');

const IS_WATCH = process.env.WATCH === 'true';

const getTime = () => {
    const date = new Date();

    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const sharedConfig = {
    entryPoints: [entryPoints],
    outfile: outfile,
    bundle: true,
    external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
    format: 'esm',
    color: true,
    minify: !IS_WATCH,
    watch: IS_WATCH
        ? {
              onRebuild(error, result) {
                  if (error)
                      console.error(
                          `[${getTime()}] watch build failed:`,
                          error,
                      );
                  else
                      console.log(
                          getTime(),
                          `[${getTime()}] build succeeded:`,
                          `errors: ${result.errors} | warnings: ${result.warnings}`,
                      );
              },
          }
        : false,
};

build(sharedConfig).then(buildResult => {
    if (IS_WATCH) {
        console.log(`[${getTime()}] start watching...`);
    } else {
        if (buildResult.errors.length === 0) {
            console.log(`[${getTime()}] build success`);
        }
    }
});
