import mongoose, { Schema } from 'mongoose';

// TODO: find the Typescript way to write this
// import { RoleType } from './role';

export interface UserType {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  role: {
    _id: Schema.Types.ObjectId;
    roleName: string;
    write: boolean;
  };
}

const userSchema = new Schema<UserType>({
  username: { type: String },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: {
      _id: Schema.Types.ObjectId,
      roleName: String,
      write: Boolean,
    },
    required: true,
  },
});

export default mongoose.model('User', userSchema);
