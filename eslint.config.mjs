import { FlatCompat } from '@eslint/eslintrc';

// mimic CommonJS variables -- not needed if using CommonJS
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// {
//     baseDirectory: __dirname,                  // optional; default: process.cwd()
//     resolvePluginsRelativeTo: __dirname,       // optional
//     recommendedConfig: js.configs.recommended, // optional unless you're using "eslint:recommended"
//     allConfig: js.configs.all,                 // optional unless you're using "eslint:all"
// }
const compat = new FlatCompat();

export default [
  ...compat.config({
    ignorePatterns: ['node_modules/', 'build/', 'bin/', 'docs/', 'tests/'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    extends: [
      'plugin:@typescript-eslint/recommended',

      'prettier',
      'plugin:prettier/recommended',
    ],
    rules: {},
  }),
];
