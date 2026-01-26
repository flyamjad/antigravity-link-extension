const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const buildOptions = {
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'out/extension.js',
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    sourcemap: true,
    minify: production,
    logLevel: 'info',
    external: ['vscode']
};

async function run() {
    if (watch) {
        const ctx = await esbuild.context(buildOptions);
        await ctx.watch();
        console.log('[esbuild] watching...');
        return;
    }
    await esbuild.build(buildOptions);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
