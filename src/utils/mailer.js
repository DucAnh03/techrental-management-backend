import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${CLIENT_URL}/verification/${token}`;

  await transporter.sendMail({
    from: `"Techrental" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Xác minh tài khoản Techrental',
    html: `<h3>Chào bạn,</h3>
    <p>Vui lòng click vào liên kết sau để xác minh tài khoản:</p>
    <a href="${verificationLink}">${verificationLink}</a>
    <p>Nếu bạn không đăng ký, vui lòng bỏ qua email này.</p>`,
  });
};

export const generateResetCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendResetCodeEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"TechRental Support" <${process.env.SMTP_MAIL}>`,
    to,
    subject: 'Mã khôi phục mật khẩu TechRental',
    html: `
      <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu TechRental.</p>
      <p>Mã xác thực của bạn là:</p>
      <h2 style="letter-spacing:4px">${code}</h2>
      <p>Mã có hiệu lực trong 15&nbsp;phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
  });
  return code; // để Controller lưu vào DB
};
