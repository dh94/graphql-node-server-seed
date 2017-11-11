import * as request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';
import User from '../../../src/db/models/User';

describe('User query test', () => {
	let id;
	before(() => {
		const user = new User();
		user.firstName = "daniel";
		user.lastName = "jackobsen";
		return user.save()
			.then(usr => {
				id = usr.id;
			});
	});

	after(() => {
		return User.remove({});
	});

	it('should find user', () => {
		return request(app)
			.post('/graphql')
			.send({
				query: `
                    query {
                        userQueries {
                            user(id: "${id}") {
                                id
                                firstName
                                lastName
                            }
                        }
                    }
                `,
			})
			.then(res => {
				expect(res.body).to.exist;
				expect(res.body.errors).to.not.exist;

				const user = res.body.data.userQueries.user;
				expect(user).to.exist;
				expect(user.id).to.eq(id);
				expect(user.firstName).to.eq('daniel');
				expect(user.lastName).to.eq('jackobsen');
			});
	});
});
