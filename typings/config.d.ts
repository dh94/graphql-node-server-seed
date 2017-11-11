export interface Environments {
	development: Configuration;
	test: Configuration;
	production: Configuration;
}

export interface Configuration {
	database: ConfigurationDatabase;
	server: ConfigurationServer;
	logger: ConfigurationLogger;
}

export interface ConfigurationDatabase {
	client: string;
	connection?: string;
}

export interface ConfigurationServer {
	host: string;
	port: string;
	graphiql: boolean;
}

export interface ConfigurationLogger {
	host?: string;
	port?: string;
	file?: ConfigurationLoggerConsole;
	console: ConfigurationLoggerConsole;
	debug: string;
}

export interface ConfigurationLoggerConsole {
	level: string;
}