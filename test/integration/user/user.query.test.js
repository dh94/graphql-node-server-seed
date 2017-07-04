import request from 'supertest-as-promised';
import app from '../../../src/app.js';
import { expect } from 'chai';
import User from '../../../src/db/models/User.js';

describe('User query test', () => {
    before(() => {
        return User.create({
            id: 2,
            firstName: "daniel",
            lastName: "jackobsen"
        })
    })
    
    after(() => {
        return User.destroy({ where: {} })
    })

    it('should find user', () => {
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
