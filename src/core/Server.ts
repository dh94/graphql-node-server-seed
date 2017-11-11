import * as express from 'express';
import * as http from 'http';

import { Environment, Logger } from './';

const log = Logger('app:core:server');

export class Server {

	public static init(): express.Application {
		return express();
	}

	public static run(app: express.Application, port: string): http.Server {
		const server = app.listen(this.normalizePort(port));
		server.on('listening', () => this.onListening(server));
		server.on('error', (error) => this.onError(server, error));
		log.debug('Server was started on environment %s', Environment.getName());
		return server;
	}

	private static normalizePort(port: string): number | string | boolean {
		const parsedPort = parseInt(port, 10);
		if (isNaN(parsedPort)) { // named pipe
			return port;
		}
		if (parsedPort >= 0) { // port number
			return parsedPort;
		}
		return false;
	}

	private static onListening(server: http.Server): void {
		log.debug(`Listening on ${this.bind(server.address())}`);
	}

	private static onError(server: http.Server, error: Error): void {
		// tslint:disable-next-line:no-string-literal
		if (error['syscall'] !== 'listen') {
			throw error;
		}
		const addr = server.address();
		// handle specific listen errors with friendly messages
		// tslint:disable-next-line:no-string-literal
		switch (error['code']) {
			case 'EACCES':
				log.error(`${this.bind(addr)} requires elevated privileges`);
				process.exit(1);
				break;
			case 'EADDRINUSE':
				log.error(`${this.bind(addr)} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	private static bind(addr: string | any): string {
		return typeof addr === 'string'
			? `pipe ${addr}`
			: `port ${addr.port}`;
	}

}
