import { merge } from 'lodash';

function calcConfig() {
    let commonConfig = {

    }
    switch(process.env.NODE_ENV){
        case 'production':
            return merge(commonConfig, {

            });
        case 'test':
        case 'development':
        default:
            return merge(commonConfig, {
                dbUrl: "postgres://postgres:1234@localhost:5432/postgres"
            });
    }
};

export default calcConfig()