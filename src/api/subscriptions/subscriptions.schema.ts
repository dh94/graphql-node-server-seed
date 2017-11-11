import { readFileSync } from 'fs';
import { pubsub } from './pubsub';
import { USER_CREATED } from './topics';

export const schema = [readFileSync(__dirname + '/subscriptions.gql', 'utf8')];

export const resolvers = {
	Subscription: {
		userCreated: {
			subscribe: () => {
				return pubsub.asyncIterator(USER_CREATED);
			},
			resolve: (payload, args, context, info) => {
				return payload;
			},
		},
	},
};
