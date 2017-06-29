import { UserConnector, UserDB } from './user.connector.js';

export class Users {
    constructor() {
        this.connector = new UserConnector();
    }

    createUser({ firstName, lastName }) {
        return UserDB.create({
            firstName,
            lastName
        })
    }

    findUsers({ ids }) {
        return this.connector.getUsers(ids);
    }
}