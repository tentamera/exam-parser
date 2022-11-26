const commonRules = {
	'@typescript-eslint/object-curly-spacing': ['error', 'always'],
	'@typescript-eslint/no-confusing-void-expression': 'off',
	'@typescript-eslint/consistent-type-definitions': 'off',
	'capitalized-comments': 'off',
	'jsx-quotes': ['error', 'prefer-double'],
};

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: 'xo',
	overrides: [
		{
			extends: [
				'xo-typescript/space',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
			rules: commonRules,
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: commonRules,
};
