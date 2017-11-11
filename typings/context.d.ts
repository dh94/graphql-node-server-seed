import { UserService } from '../src/api/user/user.service';

export interface IConnectors {
	user: UserService;
}

export interface IGraphQLContext {
	connectors: IConnectors;
}
