import dbMock from '../../../src/db/index';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

let UserMock = dbMock.define('user', {
    firstName: "daniel",
    lastName: "hallel"
});

var userModel = proxyquire('../../../src/api/user/user.model.js', {
    '../../db/models/User.js': UserMock
});

describe('User mutations', () => {
    it('should create new user', () => {
        return userModel.createUser({ firstName: "daniel", lastName: "jackobsen"})
            .then(user => {
                expect(user).to.exist;
                expect(user.firstName).to.eq('daniel');
                expect(user.lastName).to.eq('jackobsen');
            })
    });
});