// Core elements to get the server started
import {
	Environment,
	Server,
	Database,
	winstonStream,
	debugStream,
} from './core';

// Import all express libs
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

// Import all routes
import routes from './endpoints/index';

// Initialize the connection to the db
Database.init();

// Create a new express app
const app = Server.init();

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.hsts({
	maxAge: 31536000,
	includeSubdomains: true,
}));

// Enable cors for all routes and origins
app.use(cors());

// add body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Adds winston logger to the express framework
app.use(morgan('dev', debugStream));
app.use(morgan('combined', winstonStream));

// Map routes to the express application
app.use(routes);

// Starts the server and listens for common errors
export default Server.run(app, Environment.getConfig().server.port);
