import Sequelize from 'sequelize';
import winston from 'winston';
import config from '../config.js';

let sequelize = new Sequelize(config.dbUrl)

sequelize.authenticate()
    .then(() => {
        winston.info('connected to localdb');
    })

export default sequelize;