import { Environments } from 'config';

const configuration = {
	/**
	 * Development Environment
	 * ------------------------------------------
	 *
	 * This is the local development environment, which is used by the developoers
	 */
	development: {
		database: {
			connection: 'mongodb://localhost/dev',
			client: 'mongodb',
		},
		server: {
			host: 'localhost',
			port: process.env.PORT || '3000',
			graphiql: true,
		},
		logger: {
			debug: 'app*',
			console: {
				level: 'error',
			},
		},
	},
	/**
	 * Test Environment
	 * ------------------------------------------
	 *
	 * This environment is used by the unit, migration and database test.
	 */
	test: {
		database: {
			connection: 'mongodb://localhost/test',
			client: 'mongodb',
		},
		server: {
			host: 'localhost',
			port: process.env.PORT || '3000',
			graphiql: false,
		},
		logger: {
			debug: '',
			console: {
				level: 'info',
			},
		},
	},
	/**
	 * Production Environment
	 * ------------------------------------------
	 *
	 * This configuration will be used by the cloud servers. You are abel to override
	 * them with the local cloud environment variable to make it even more configurable.
	 */
	production: {
		database: {
			connection: 'mongodb://localhost/prod',
			client: 'mongodb',
		},
		server: {
			host: 'localhost',
			port: process.env.PORT || '3000',
			graphiql: false,
		},
		logger: {
			debug: '',
			console: {
				level: 'debug',
			},
		},
	},
} as Environments;
export default configuration;
