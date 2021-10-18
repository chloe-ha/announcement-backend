import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';

import Role, { RoleType } from './models/role';
import User from './models/user';
import authRoutes from './routes/auth';
import announcementRoutes from './routes/announcement';
import userRoutes from './routes/user';

declare module 'express-session' {
  export interface SessionData {
    user: {
      username: string;
      email: string;
      role: {
        roleName: string;
        write: boolean;
      }
    };
  }
}

dotenv.config();
const PORT = process.env.PORT || 8080;
const URI = process.env.MONGODB_URI || '';
const CLIENT = process.env.CLIENT_URL || 'http://localhost:3000'

const app = express();
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: URI,
  collection: 'sessions'
});

app.use(express.json());
var corsOptions = {
  origin: CLIENT,
  credentials: true
};

app.use(cors(corsOptions));
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true, store, cookie: { maxAge: 60 * 60 * 1000 }}));

// app.use((req, res, next) => {
//   if (!req.session.user && req.url !== '/login' && req.url !== '/isAuth') {
//     return res.sendStatus(401);
//   }
//   next();
// });

app.use(authRoutes);
app.use(announcementRoutes);
app.use(userRoutes);

mongoose.connect(URI, { })
  .then(() => {
    let adminRole: RoleType;
    Role.find()
      .then(roles => {
        if (roles.length === 0) {
          const roles = [
            { roleName: 'Admin', write: true },
            { roleName: 'Manager', write: false },
            { roleName: 'Staff', write: false }
          ];
          return Role.create(roles);
        } else {
          adminRole = roles.find(r => r.roleName === 'Admin');
          return;
        }
      })
      .then(roles => {
        if (roles) {
          adminRole = roles.find(r => r.roleName === 'Admin');
        }
        return User.find({ 'role.roleName': 'Admin' });
      })
      .then(adminUser => {
        if (!adminUser.length) {
          return bcrypt.hash('admin', 12).then(password => {
            return new User({
              username: 'Admin',
              password,
              email: 'admin@admin.com',
              role: adminRole
            }).save();
          });
        }
      })
      .then(() => {
        console.log(`App is running on port ${PORT}`);
        app.listen(PORT);
      })
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err));
