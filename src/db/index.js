import Sequelize from 'sequelize';
import SequelizeMock from 'sequelize-mock';
import winston from 'winston';
import { config } from '../config.js';

let sequelize;
if (process.env.NODE_ENV !== 'test') {
    sequelize = new Sequelize(config.dbUrl)
    sequelize.authenticate()
        .then(() => {
            winston.info('connected to localdb');
            sequelize.sync({force: true})
        })
} else
    sequelize = new SequelizeMock();

export default sequelize;