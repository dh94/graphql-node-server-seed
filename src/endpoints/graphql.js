import { graphqlExpress } from 'graphql-server-express';
import { Router } from 'express'
import schema from '../api/schema.js';
import { Users } from '../api/user/user.model.js';

const router = Router();
router.use('/graphql', graphqlExpress((req) => {
    return {
        schema,
        context: {
            users: new Users()
        }
    }
}));

export default router;