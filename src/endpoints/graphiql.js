import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { Router } from 'express'

const router = Router();
router.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  })
);

export default router;