import * as request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';
import User from '../../../src/db/models/User';

describe('User mutation test', () => {
	after(() => {
		return User.remove({});
	});

	it('should create user', () => {
		return request(app)
			.post('/graphql')
			.send({
				query: `
					mutation {
						userMutations{
							createUser(firstName: "dany", lastName:"god") {
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

				const user = res.body.data.userMutations.createUser;
				expect(user).to.exist;
				expect(user.id).to.exist;
				expect(user.firstName).to.eq('dany');
				expect(user.lastName).to.eq('god');

				return User.findById(user.id);
			})
			.then(user => {
				expect(user).to.exist;
				expect(user.firstName).to.eq('dany');
				expect(user.lastName).to.eq('god');
			});
	});
});
