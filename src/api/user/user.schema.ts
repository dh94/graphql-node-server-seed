import { readFileSync } from 'fs';
import { pubsub } from '../subscriptions/pubsub';
import { USER_CREATED } from '../subscriptions/topics';
import { IGraphQLContext } from 'context';

export * from './user.service';

export const schema = [readFileSync(__dirname + '/user.gql', 'utf8')];

export const resolvers = {
	UserQueries: {
		users: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.user.findUsers(args);
		},
		user: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.user.findUsers({ ids: [args.id] })
				.then(foundUsers => {
					return foundUsers[0];
				});
		},
	},
	UserMutations: {
		createUser: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.user.createUser(args)
				.then(user => {
					pubsub.publish(USER_CREATED, user);
					return user;
				});
		},
	},
};
