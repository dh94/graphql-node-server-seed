import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { IConnectors } from 'context';

import { schema as rootSchema, resolvers as rootResolvers } from './root/root.schema';
import { schema as subscriptionSchema, resolvers as subscriptionsResolvers } from './subscriptions/subscriptions.schema';
import { schema as userSchema, resolvers as userResolvers, UserService as UserConnector } from './user/user.schema';

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [...rootSchema, ...userSchema, ...subscriptionSchema];
const resolvers = merge(rootResolvers, userResolvers, subscriptionsResolvers);
export function attachConnectors(context) {
	context.connectors = {
		user : new UserConnector(),
	} as IConnectors;
}

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers,
});

export default executableSchema;
