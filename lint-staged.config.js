/**
 * @see https://github.com/lint-staged/lint-staged?tab=readme-ov-file#using-js-configuration-files
 * @type {import('lint-staged').Config}
 */

export default {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '*': (filenames) => filenames.map((filename) => `prettier --ignore-unknown --write '${filename}'`),
};
