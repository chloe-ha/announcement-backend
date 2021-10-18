import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  datetime: { type: Date, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
});

export default mongoose.model('Announcement', announcementSchema);
