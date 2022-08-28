const path = require('path');

const entryPoints = path.resolve(__dirname, './src/index.ts');
const outfile = path.resolve(__dirname, 'dist/index.js');

const buildResult = require('esbuild').buildSync({
    entryPoints: [entryPoints],
    outfile: outfile,
    bundle: true,
    external: ['react'],
    format: 'esm',
    minify: true,
});

if (buildResult.errors.length === 0) {
    console.log('build success');
}
