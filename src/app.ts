import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import announcementRoutes from './routes/announcement';

dotenv.config();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI || '';

const app = express();

app.use(express.json());
app.use(cors());

app.use(announcementRoutes);

mongoose.connect(URI, { })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT);
  })
  .catch(err => console.log(err));
