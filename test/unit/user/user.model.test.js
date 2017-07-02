import dbMock from '../../../src/db/index';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

let UserMock = dbMock.define('user', {
    firstName: "daniel",
    lastName: "hallel"
});

let userConnector = proxyquire('../../../src/api/user/user.connector.js', {
    '../../db/models/User.js': UserMock
})
let userModel = proxyquire('../../../src/api/user/user.model.js', {
    './user.connector.js': userConnector
});

let users = new userModel.Users();

describe('User model', () => {

    afterEach(() => {
        UserMock.$clearQueue();
    })

    it('should create new user', () => {
        return users.createUser({ firstName: "daniel", lastName: "jackobsen"})
            .then(user => {
                expect(user).to.exist;
                expect(user.firstName).to.eq('daniel');
                expect(user.lastName).to.eq('jackobsen');
            })
    });

    describe('findUsers', () => {
        it('should find many ids - all exist', () => {
            let findIds = [1, 2, 3];
            
            UserMock.$queueResult(findIds.map(id => {
                return UserMock.build({
                    id, 
                    firstName: "daniel",
                    lastName: "jackobsen"
                })
            }));

            return users.findUsers({ ids: findIds})
                .then(_users => {
                    expect(_users).to.have.lengthOf(3);

                    for (let user of _users) {
                        expect(user).to.exist;
                    }
                })
        })

        it('should find only one id', () => {
            let findIds = [1];
            
            UserMock.$queueResult(findIds.map(id => {
                return UserMock.build({
                    id, 
                    firstName: "daniel",
                    lastName: "jackobsen"
                })
            }));

            return users.findUsers({ ids: findIds})
                .then(users => {
                    expect(users).to.have.lengthOf(1);
                    expect(users[0]).to.exist;
                })
        })
    })
});