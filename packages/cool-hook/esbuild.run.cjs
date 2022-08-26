const path = require('path');

const entryPoints = path.resolve(__dirname, './src/index.ts');
const outfile = path.resolve(__dirname, 'dist/index.js');

let res = require('esbuild').buildSync({
    entryPoints: [entryPoints],
    outfile: outfile,
    bundle: true,
    external: ['react'],
    format: 'esm',
});

if (res.errors.length === 0) {
    console.log('build success');
}
