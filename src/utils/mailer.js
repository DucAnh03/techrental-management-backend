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

export const sendResetPasswordEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/api/auth/forgotPassword/${token}`;

  await transporter.sendMail({
    from: `"Techrental Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Khôi phục mật khẩu Techrental',
    html: `<p>Click vào link bên dưới để đặt lại mật khẩu:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Liên kết có hiệu lực trong 15 phút.</p>`,
  });
};
