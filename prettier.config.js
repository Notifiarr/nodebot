/**
 * @see https://prettier.io/docs/en/configuration
 * @type {import("prettier").Config}
 */

export default {
    bracketSpacing: true,
    plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-packagejson'],
    printWidth: 120,
    singleQuote: true,
    trailingComma: 'all',
};
