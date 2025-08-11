import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
// Avoid legacy shareable presets to keep flat config compatibility stable

export default tseslint.config([
    globalIgnores([
        'dist',
        'dist-electron',
        'release',
        'eslint.config.js',
        'prettier.config.js',
        'electron-builder.json5',
    ]),
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
            prettier: prettierPlugin,
        },
        extends: [
            js.configs.recommended,
            // Type-aware + strict rules for TypeScript
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strictTypeChecked,
            // Disable stylistic rules that conflict with Prettier formatting
            prettierConfig,
        ],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.renderer.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: { project: ['tsconfig.renderer.json'] },
                node: true,
            },
        },
        rules: {
            // React extras
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-key': ['error', { checkFragmentShorthand: true }],
            'react/no-unstable-nested-components': 'warn',
            'react-refresh/only-export-components': 'warn',

            // Imports
            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/newline-after-import': 'warn',
            'import/no-unresolved': 'off',

            // removed unicorn/security/secrets rules per request
            // Run Prettier as an ESLint rule (optional; can be run separately)
            'prettier/prettier': 'warn',
        },
    },
    {
        files: ['electron/**/*.{js,ts,tsx}', 'vite.config.ts'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
            prettier: prettierPlugin,
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strictTypeChecked,
            prettierConfig,
        ],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: globals.node,
            parserOptions: {
                project: ['./tsconfig.electron.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            'import/resolver': {
                typescript: { project: ['tsconfig.electron.json'] },
                node: true,
            },
        },
        rules: {
            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/newline-after-import': 'warn',
            'import/no-unresolved': 'off',
            'prettier/prettier': 'warn',
        },
    },
]);
