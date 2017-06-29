import Sequelize from 'sequelize';
import SequelizeMock from 'sequelize-mock';
import winston from 'winston';

let sequelize;
if (process.env.NODE_ENV !== 'production') {
    sequelize = new Sequelize("postgres://postgres:1234@localhost:5432/postgres")
    sequelize.authenticate()
        .then(() => {
            winston.info('connected to localdb');
            sequelize.sync({force: true})
        })
} else
    sequelize = new SequelizeMock();

export default sequelize;