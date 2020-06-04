import nodemailer from 'nodemailer';
import { Color } from '~/globals';

type SendEmailType = {
    email: string,
    subject: string,
    text: string
}
export const sendEmail = async (options: SendEmailType) => {

    const { email, subject, text } = options;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(`${process.env.SMTP_PORT}`.toString()),
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: subject,
        text: text
    };

    const info = await transporter.sendMail(message);

    console.log(Color.FgGreen, "Message sent: %s", info.messageId);
}