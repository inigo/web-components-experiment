import { customElementJetBrainsPlugin } from "custom-element-jet-brains-integration";

// noinspection JSUnusedGlobalSymbols
export default {
    globs: ['src/**/*-element.ts'],
    exclude: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: [
        customElementJetBrainsPlugin()
    ],
    outdir: '.',
    litelement: true,
    dev: false,
};