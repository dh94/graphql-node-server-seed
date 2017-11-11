import MongoMemoryServer from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { Logger } from '../src/core/Logger';
import * as Promise from 'Bluebird';

let mongoServer;
const opts = {
	promiseLibrary: Promise,
	useMongoClient: true,
};

// failsafe
if (!process.env.NODE_ENV)
	process.env.NODE_ENV = "test";

before(function(done) {
	this.timeout(120000);
	Logger("bootstrap - test").info("preparing mongodb-inmemory-server");
	mongoServer = new MongoMemoryServer();

	mongoServer.getConnectionString().then((mongoUri) => {
		mongoose.connect(mongoUri, opts, (err) => {
			if (!err)
				Logger("bootstrap - test").info("finished - " + mongoUri);
			done(err);
		});
	});
});

after(() => {
	Logger("bootstrap - test").info("mongodb-inmemory-server: closed");
	mongoose.disconnect();
	mongoServer.stop();
});
