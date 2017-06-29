import { graphqlExpress } from 'graphql-server-express';
import { Router } from 'express'
import schema from '../api/schema.js';

const router = Router();
router.use('/graphql', graphqlExpress((req) => {
    return {
        schema,
        context: {}
    }
}));

export default router;