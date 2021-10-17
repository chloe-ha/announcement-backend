import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // TODO role
  datetime: { type: Date, required: true },
});

export default mongoose.model('Announcement', announcementSchema);
