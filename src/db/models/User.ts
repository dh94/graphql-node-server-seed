import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	firstName: string;
	lastName?: string;
}

export const UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: String,
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
