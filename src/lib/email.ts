
import nodemailer from "nodemailer";

export async function sendEmail({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.naver.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Logos Arena" <${process.env.SMTP_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
}
