import { readFileSync } from 'fs';
import { pubsub } from '../subscriptions/pubsub.js';
import { USER_CREATED } from '../subscriptions/topics.js';

export const schema = [readFileSync(__dirname + '/user.gql', 'utf8')]

export const resolvers = {
    UserQueries: {
        users: (root, args, { users }) => {
            return users.findUsers(args)
        },
        user: (root, args, { users }) => {
            return users.findUsers({ ids: [args.id]})
                .then(users => {
                    return users[0]
                })
        }
    },
    UserMutations: {
        createUser: (root, args, { users }) => {
            return users.createUser(args)
                .then(user => {
                    pubsub.publish(USER_CREATED, user);
                    return user;
                })
        }
    }
}