import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { Logger } from '../core/Logger';
import schema from '../api/schema';

const logger = Logger("app:graphql-subscriptions");
const WS_PORT = process.env.WS_PORT || 5000;

export class GQLSubscriptionServer {
	public static init() {
		// Create WebSocket listener server
		const websocketServer = createServer((request, response) => {
			response.writeHead(404);
			response.end();
		});

		// Bind it to port and start listening
		websocketServer.listen(WS_PORT, () => logger.debug(
			`Websocket Server is now running on ws://localhost:${WS_PORT}`,
		));

		SubscriptionServer.create(
			{
				schema,
				execute,
				subscribe,
			} as any,
			{
				server: websocketServer,
				path: '/graphql-subscription',
			},
		);
	}
}
