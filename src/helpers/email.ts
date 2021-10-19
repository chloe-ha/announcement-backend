import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

dotenv.config();
const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY || '';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: { api_key: SEND_GRID_API_KEY },
}));

export const sendEmail = (
  to: string | string[],
  subject: string,
  htmlBuilder: (clientUrl: string) => string,
) => {
  transporter.sendMail({
    to,
    from: 'c.ha@groupeonepoint.com',
    subject,
    html: htmlBuilder(CLIENT_URL),
  });
};
