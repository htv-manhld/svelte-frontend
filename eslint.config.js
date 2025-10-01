import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',
			// Enforce max line length (handled by prettier, but good to have)
			'max-len': [
				'warn',
				{
					code: 120,
					tabWidth: 2,
					ignoreUrls: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
					ignoreRegExpLiterals: true,
					ignoreComments: true
				}
			],
			// Svelte specific rules - make them warnings instead of errors
			'svelte/no-navigation-without-resolve': 'warn',
			'svelte/require-each-key': 'warn',
			'svelte/no-at-html-tags': 'warn',
			// TypeScript rules - make unused vars warnings
			'@typescript-eslint/no-unused-vars': 'warn'
			// Import organization and SvelteKit alias preferences
			// Note: import/order rule requires eslint-plugin-import
			// 'import/order': [
			// 	'warn',
			// 	{
			// 		groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
			// 		'newlines-between': 'always',
			// 		alphabetize: {
			// 			order: 'asc',
			// 			caseInsensitive: true
			// 		},
			// 		pathGroups: [
			// 			{
			// 				pattern: '$lib/**',
			// 				group: 'internal',
			// 				position: 'before'
			// 			},
			// 			{
			// 				pattern: '$app/**',
			// 				group: 'internal',
			// 				position: 'before'
			// 			}
			// 		],
			// 		pathGroupsExcludedImportTypes: ['builtin']
			// 	}
			// ]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Disable max-len for .svelte files (Tailwind classes are often long)
			'max-len': 'off',
			// Disable navigation warnings for static links
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
