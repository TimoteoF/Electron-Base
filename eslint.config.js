import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import electronPlugin from 'eslint-plugin-electron';
import security from 'eslint-plugin-security';
import noSecrets from 'eslint-plugin-no-secrets';

export default tseslint.config([
    globalIgnores(['dist', 'dist-electron', 'release']),
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
            unicorn,
            sonarjs,
            electron: electronPlugin,
            security,
            'no-secrets': noSecrets,
        },
        extends: [
            js.configs.recommended,
            // Type-aware + strict rules for TypeScript
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strictTypeChecked,
            // React core + JSX runtime + Hooks and Vite Fast Refresh
            react.configs.recommended,
            react.configs['jsx-runtime'],
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            // SonarJS recommended (code smells & complexity)
            sonarjs.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                // Enable type-aware linting without listing every tsconfig
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: { project: true },
                node: true,
            },
        },
        rules: {
            // React extras
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-key': ['error', { checkFragmentShorthand: true }],
            'react/no-unstable-nested-components': 'warn',

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

            // Unicorn (curated subset)
            'unicorn/prefer-node-protocol': 'warn',
            'unicorn/prefer-top-level-await': 'warn',
            'unicorn/prevent-abbreviations': 'off',

            // Security & secrets
            'security/detect-unsafe-regex': 'warn',
            'security/detect-object-injection': 'off',
            'no-secrets/no-secrets': ['warn', { tolerance: 4.2, ignoreContent: true }],
        },
    },
    {
        files: ['src/**/*.{jsx,tsx}'],
        extends: [jsxA11y.configs.recommended],
    },
    {
        files: ['electron/**/*.{js,ts,tsx}', 'vite.config.ts', 'electron-builder.json5'],
        languageOptions: { globals: globals.node },
        rules: {
            'electron/no-unfiltered-navigate': 'error',
        },
    },
    {
        files: ['src/**/*.{js,ts,tsx}'],
        rules: {
            'electron/no-node-in-renderer': 'error',
        },
    },
]);
