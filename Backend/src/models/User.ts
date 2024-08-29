import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    profile_url: string | null;
    role: ['admin', 'user'];
}

const userSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profile_url: {type: String || null, default: null},
    role: {type: String, enum: ['admin', 'user'], default: 'user'}
})

export default mongoose.model<IUser>("User", userSchema);