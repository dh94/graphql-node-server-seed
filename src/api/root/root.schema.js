import { readFileSync } from 'fs';

export const schema = [readFileSync(__dirname + '/root.gql', 'utf8')]

export const resolvers = {
    Query: {
        userQueries: () => ({})
    },
    Mutation: {
        userMutations: () => ({})
    }
}