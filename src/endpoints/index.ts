import { Router } from 'express';
import graphqlEndpoint from './graphql';
import graphiqlEndpoint from './graphiql';
import { GQLSubscriptionServer } from './graphql-subscriptions';
import monitorEndpoint from './monitor';

const router = Router();
router.use(graphqlEndpoint);
router.use(graphiqlEndpoint);
router.use(monitorEndpoint);

// the subscription uses webSocket so it doesn't register in the router
GQLSubscriptionServer.init();

export default router;
