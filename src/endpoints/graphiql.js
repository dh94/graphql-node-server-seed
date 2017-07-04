import { graphiqlExpress } from 'graphql-server-express';
import { Router } from 'express'

const router = Router();
router.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:5000/graphql-subscription'
  })
);

export default router;