import SequelizeMock from 'sequelize-mock';
import { __RewireAPI__ as ConnectorRewireAPI } from '../../../src/api/user/user.connector.js';
import { Users } from '../../../src/api/user/user.model.js';
import { expect } from 'chai';

describe('User model', () => {
    let UserMock = new SequelizeMock().define('user');
    let userService;

    before(() => {
        ConnectorRewireAPI.__Rewire__('User', UserMock);
    })

    beforeEach(() => {
        // so results wont be cached in dataloader
        userService = new Users();
    })

    after(() => {
        ConnectorRewireAPI.__ResetDependency__('User');
    })

    afterEach(() => {
        UserMock.$clearQueue();
    })

    it('should create new user', () => {
        return userService.createUser({ firstName: "daniel", lastName: "jackobsen"})
            .then(user => {
                expect(user).to.exist;
                expect(user.firstName).to.eq('daniel');
                expect(user.lastName).to.eq('jackobsen');
            })
    });

    describe('findUsers', () => {
        it('should find many ids - all exist', () => {
            let findIds = ['1', '2', '3'];
            
            UserMock.$queueResult(findIds.map(id => {
                return UserMock.build({
                    id, 
                    firstName: "daniel",
                    lastName: "jackobsen"
                })
            }));

            return userService.findUsers({ ids: findIds})
                .then(_users => {
                    expect(_users).to.have.lengthOf(3);

                    for (let user of _users) {
                        expect(user).to.exist;
                    }
                })
        })

        it('should find only one id', () => {
            let findIds = ['1'];
            
            UserMock.$queueResult(findIds.map(id => {
                return UserMock.build({
                    id, 
                    firstName: "sup",
                    lastName: "boy"
                })
            }));

            return userService.findUsers({ ids: findIds})
                .then(users => {
                    expect(users).to.have.lengthOf(1);
                    expect(users[0]).to.exist;
                    expect(users[0].firstName).to.eq('sup');
                    expect(users[0].lastName).to.eq('boy');
                })
        })
    })
});