// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
    rules: {
        // General Layout & Indentation
        indent: ['error', 4], // Indentation - 4 spaces
        quotes: ['error', 'single'], // Prefer single quotes
        semi: ['error', 'always'], // Always use semicolons

        // Curly Brackets Placement
        'brace-style': ['error', 'allman', {allowSingleLine: true}],

        // Function Conventions
        'prefer-arrow-callback': 'error',
        'func-style': ['error', 'declaration', {allowArrowFunctions: true}],
        // No space after function name
        'space-before-function-paren': ['error', 'never'],

        // Asynchrony
        // Prefer async/await over .then/.catch
        // "@typescript-eslint/promise-function-async": "error", //todo fix ts

        // Naming Conventions
        '@typescript-eslint/naming-convention': [
            'error',
            // Variables, functions, and attributes: camelCase
            {selector: 'variable', format: ['camelCase', 'UPPER_CASE']},
            {selector: 'function', format: ['camelCase']},
            {selector: 'parameter', format: ['camelCase']},
            // Classes, Enums, Interfaces: PascalCase
            {selector: 'typeLike', format: ['PascalCase']},
            // Enum keys and Constants: SCREAMING_SNAKE_CASE [cite: 137, 150]
            {selector: 'enumMember', format: ['UPPER_CASE']}
        ],

        // No trailing comma in objects
        'comma-dangle': ['error', 'never'],
        // Space after colon [cite: 71]
        'key-spacing': ['error', {afterColon: true}],

        // No spaces inside curly brackets for imports
        'object-curly-spacing': ['error', 'never']
    }
});
