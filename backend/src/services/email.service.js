const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'Alfred Golf <noreply@alfredgolf.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    // Don't throw — email failure shouldn't block the main flow
  }
};

// ── Email templates ───────────────────────────────────────────────────────────

const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Alfred Golf — Play. Give. Win.',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1a13; color: #e8e2d6; padding: 40px; border-radius: 12px;">
        <h1 style="color: #c9a84c; font-size: 28px;">Welcome, ${user.firstName}!</h1>
        <p style="color: #e8e2d6; line-height: 1.6;">You've joined Alfred Golf — the golf lottery where every ticket gives back.</p>
        <p style="color: #e8e2d6;">Log your golf scores to enter monthly prize draws and support your chosen charity.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #c9a84c; color: #0e1a13; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">Go to Dashboard</a>
        <p style="margin-top: 40px; color: #888; font-size: 12px;">Alfred Golf · Play. Give. Win.</p>
      </div>
    `,
  });
};

const sendDrawResultEmail = async (user, draw) => {
  await sendEmail({
    to: user.email,
    subject: `Draw Results: ${draw.name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1a13; color: #e8e2d6; padding: 40px; border-radius: 12px;">
        <h1 style="color: #c9a84c;">Draw Results</h1>
        <h2 style="color: #e8e2d6;">${draw.name}</h2>
        <p>Winning Numbers: <strong style="color: #c9a84c;">${draw.winningNumbers.join(', ')}</strong></p>
        <a href="${process.env.FRONTEND_URL}/dashboard/draws" style="display: inline-block; background: #c9a84c; color: #0e1a13; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">View My Results</a>
      </div>
    `,
  });
};

const sendWinnerNotificationEmail = async (user, winner, draw) => {
  await sendEmail({
    to: user.email,
    subject: `🏆 Congratulations! You won the ${draw.name}!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1a13; color: #e8e2d6; padding: 40px; border-radius: 12px;">
        <h1 style="color: #c9a84c;">🏆 You're a Winner!</h1>
        <p>Congratulations <strong>${user.firstName}</strong>! You matched <strong>${winner.tier} numbers</strong> in the ${draw.name}.</p>
        <p>Prize: <strong style="color: #c9a84c;">£${(winner.prize / 100).toFixed(2)}</strong></p>
        <p>To claim your prize, please submit verification proof:</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/draws" style="display: inline-block; background: #c9a84c; color: #0e1a13; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">Submit Proof</a>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Alfred Golf — Password Reset Request',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1a13; color: #e8e2d6; padding: 40px; border-radius: 12px;">
        <h1 style="color: #c9a84c;">Reset Your Password</h1>
        <p>You requested a password reset for your Alfred Golf account.</p>
        <p>This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #c9a84c; color: #0e1a13; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">Reset Password</a>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendDrawResultEmail,
  sendWinnerNotificationEmail,
  sendPasswordResetEmail,
};
