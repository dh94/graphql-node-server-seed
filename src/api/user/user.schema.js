import { readFileSync } from 'fs';

export const schema = [readFileSync(__dirname + '/user.gql', 'utf8')]

export const resolvers = {
    
}