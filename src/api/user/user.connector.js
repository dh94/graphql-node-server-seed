import User from '../../db/models/User.js';
import Dataloader from 'dataloader';

export const UserDB = User;

export class UserConnector {
    constructor() {
        this.userLoader = new Dataloader(userIds => this.__getUsers(userIds))
    }

    __getUsers(userIds) {
        return User.findAll({
            where: {
                id: {
                    $in: userIds
                }
            }
        }).then(results => {
            return userIds.map(id => {
                return results.filter(result => `${result.id}` === id)[0];
             });
        })
    }

    getUsers(ids) {
        return this.userLoader.loadMany(ids)
    }

    getUser(userId) {
        return this.userLoader.load(userId);
    }
}