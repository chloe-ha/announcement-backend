import mongoose, { Schema } from 'mongoose';

export interface RoleType {
  _id: Schema.Types.ObjectId;
  roleName: string;
  write: boolean;
}

const roleSchema = new Schema<RoleType>({
  roleName: { type: String, required: true, unique: true },
  write: { type: Boolean, required: true },
});

export default mongoose.model('Role', roleSchema);
