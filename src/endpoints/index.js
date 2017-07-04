import { Router } from 'express'
import graphqlEndpoint from './graphql';
import graphiqlEndpoint from './graphiql';
import graphqlSubscription from './graphql-subscriptions';

const router = Router();
router.use(graphqlEndpoint)
router.use(graphiqlEndpoint)

export default router;