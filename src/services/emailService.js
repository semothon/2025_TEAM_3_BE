const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendPasswordResetEmail(toEmail, resetToken) {
    const resetLink = `http://15.164.104.116:3034/resetPassword?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "비밀번호 재설정 요청",
        text: `아래 링크를 클릭하여 비밀번호를 재설정 하십시오:\n${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };