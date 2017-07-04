import request from 'supertest-as-promised';
import app from '../../../src/app.js';
import { expect } from 'chai';
import dbMock from '../../../src/db/index';
import { __RewireAPI__ as ConnectorRewireAPI } from '../../../src/api/user/user.connector.js';

describe('User query test', () => {
    let UserMock = dbMock.define('user', {
        id: "2",
        firstName: "daniel",
        lastName: "hallel"
    });

    before(() => {
        ConnectorRewireAPI.__Rewire__('User', UserMock);
    })

    after(() => {
        ConnectorRewireAPI.__ResetDependency__('User');
    })

    it('should find user', () => {
        UserMock.$queueResult([UserMock.build({
            id: 2, 
            firstName: "daniel",
            lastName: "jackobsen"
        })]);

        return request(app)
            .post('/graphql')
            .send({
                query: `
                    query {
                        userQueries {
                            user(id: "2") {
                                id
                                firstName
                                lastName
                            }
                        }
                    }
                `
            })
            .then(res => {
                expect(res.body).to.exist;
                
                let user = res.body.data.userQueries.user;
                expect(user).to.exist;
                expect(user.id).to.eq('2');
                expect(user.firstName).to.eq('daniel');
                expect(user.lastName).to.eq('jackobsen');
            })
    })
})
