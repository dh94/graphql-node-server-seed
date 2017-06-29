import { Router } from 'express'
import graphqlEndpoint from './graphql';
import graphiqlEndpoint from './graphiql';

const router = Router();
router.use(graphqlEndpoint)
router.use(graphiqlEndpoint)

export default router;