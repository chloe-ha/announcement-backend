import mongoose, { Schema } from 'mongoose';

interface Role {
  roleName: string;
  write: boolean;
}

const roleSchema = new Schema<Role>({
  roleName: { type: String, required: true, unique: true },
  write: { type: Boolean, required: true },
});

export default mongoose.model('Role', roleSchema);
