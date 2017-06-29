import { readFileSync } from 'fs';
import { createUser,  } from './user.model.js';

export const schema = [readFileSync(__dirname + '/user.gql', 'utf8')]

export const resolvers = {
    UserQueries: {
        users: (root, args, { users }) => {
            return users.findUsers(args)
                .then(selectedUsers => {
                    return selectedUsers;
                })
        }
    },
    UserMutations: {
        createUser: (root, args, { users }) => {
            return users.createUser(args);
        }
    }
}