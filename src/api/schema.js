import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { schema as rootSchema, resolvers as rootResolvers } from './root/root.schema'
import { schema as userSchema, resolvers as userResolvers } from './user/user.schema'

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [...rootSchema, ...userSchema];
const resolvers = merge(rootResolvers, userResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;