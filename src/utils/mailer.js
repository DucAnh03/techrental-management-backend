import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;

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
  Math.floor(100000 + Math.random() * 900000).toString(); // 6 số

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
