module.exports = {
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	setupFilesAfterEnv: [
		"<rootDir>/src/tests/setupTest.ts"
	],
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
	},
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		"\\.(scss|css|sass)$": "identity-obj-proxy"
	},
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.tsx",
		"!src/**/_document.tsx",
		"!src/**/_app.tsx",
		"!src/**/*.spec.tsx",
	],
	coverageReporters: ["lcov", "json"]
};