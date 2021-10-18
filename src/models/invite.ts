import mongoose, { Schema } from 'mongoose';

interface InviteType {
  email: string;
  role: string;
  token: string;
  tokenExpiry: Date;
}

const inviteSchema = new Schema<InviteType>({
  email: { type: String, required: true },
  role: { type: String, required: true },
  token: { type: String, required: true },
  tokenExpiry: { type: Date, required: true },
});

export default mongoose.model('Invite', inviteSchema);
