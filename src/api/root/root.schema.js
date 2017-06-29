import { readFileSync } from 'fs';

export const schema = [readFileSync(__dirname + '/root.gql', 'utf8')]

export const resovlers = {
    Query: {
        userQueries: () => ({})
    },
    Mutation: {
        userMutations: () => ({})
    }
}