import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './templates';

export const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  requireTLS: true, // optional, if you require STARTTLS
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
} as SMTPTransport.Options);

export const sendWelcomeEmail = async ({ name, email, intro }: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);

  await transporter.sendMail({
    from: `"Signalist" <signalist@gmail.com>`,
    to: email,
    subject: 'Welcome to Signalist - your stock market toolkit is ready!',
    text: 'Thanks for joining signalist',
    html: htmlTemplate,
  });
};

export const sendNewsSummaryEmail = async ({ email, date, newsContent }: { email: string; date: string; newsContent: string }) => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace('{{date}}', date).replace('{{newsContent}}', newsContent);

  await transporter.sendMail({
    from: `"Signalist News" <signalist@gmail.com>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  });
};
