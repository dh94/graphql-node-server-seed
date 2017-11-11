import * as mongoose from 'mongoose';
import * as Bluebird from 'bluebird';
import { Environment, Logger } from './';

const log = Logger('app:database');
export class Database {
	public static init(): Promise<void> {
		log.debug('Connecting to database %s', Environment.getConfig().database.connection.split('@')[1]);
		
		(mongoose.Promise as any) = Promise;

		if (!Environment.isTest())
			return mongoose.connect(Environment.getConfig().database.connection, {
				promiseLibrary: Bluebird,
				useMongoClient: true,
			}).then(() => {
				log.debug("successfully connected to the database");
			});
		else {
			log.debug("testing database setup");
			return Promise.resolve();
		}
	}
}
