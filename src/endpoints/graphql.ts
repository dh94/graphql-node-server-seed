import { Logger } from '../core';
import { graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import schema from '../api/schema';
import { attachConnectors } from '../api/schema';

const router = Router();
router.use('/graphql', graphqlExpress((req, res) => {
	const context = {};
	attachConnectors(context);
	return { 
		schema,
		context,
		formatError: (error) => {
			Logger("app:graphql").error(error);
			return error;
		},
	} as any;
}));

export default router;
