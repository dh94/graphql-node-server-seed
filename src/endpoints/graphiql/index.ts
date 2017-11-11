import { graphiqlExpress } from './graphiQLCostume';
import { Router, static as expressStatic } from 'express';

const router = Router();
// kind of shitty solution so graphiql will work offline with subscriptions :(
router.use('/graphiql-resources', expressStatic(__dirname + '/resources'));

router.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: 'ws://localhost:5000/graphql-subscription',
}),
);

export default router;
