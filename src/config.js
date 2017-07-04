import { merge } from 'lodash';

function calcConfig() {
    let commonConfig = {

    }
    switch(process.env.NODE_ENV){
        case 'test':
        case 'development':
            return merge(commonConfig, {
                dbUrl: "postgres://postgres:1234@localhost:5432/postgres"
            });
        case 'production':
            return merge(commonConfig, {

            });
    }
};

export let config = calcConfig();