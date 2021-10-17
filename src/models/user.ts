import mongoose, { Schema } from 'mongoose';

export interface UserType {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  role: Schema.Types.ObjectId;
}

const userSchema = new Schema<UserType>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'role', required: true },
});

export default mongoose.model('User', userSchema);
