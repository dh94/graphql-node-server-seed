import { IUser } from '../../db';
import User from '../../db/models/User';
import * as Dataloader from 'dataloader';

export class UserService {
	private userLoader: Dataloader<string, IUser>;
	constructor() {
		this.userLoader = new Dataloader<string, IUser>(userIds => this.loadUsers(userIds));
	}

	public createUser({ firstName, lastName }): Promise<IUser> {
		const usr = new User();
		usr.firstName = firstName;
		usr.lastName = lastName;
		return usr.save();
	}

	public findUsers({ ids }): Promise<IUser[]> {
		return this.userLoader.loadMany(ids);
	}

	private loadUsers(ids): Promise<IUser[]> {
		return User.find({
			_id: {
				$in: ids,
			},
		}).then(results => {
			return ids.map(id => {
				return results.filter(result => `${result.id}` === id)[0];
			});
		});
	}
}
