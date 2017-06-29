import db from '../index';
import Sequelize from 'sequelize';

let User = db.define('User', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
});

export default User;
