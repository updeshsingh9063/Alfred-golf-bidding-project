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
      <div style="font-family: Inter, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1a13; color: #e8e2d6; padding: 40px; border-radius: 12px; border: 1px solid #1a2c21;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #c9a84c; font-size: 32px; font-weight: 700; margin-bottom: 8px;">Welcome to Alfred, ${user.firstName}.</h1>
          <p style="color: #8da396; font-size: 16px; margin-top: 0;">The golf platform where every swing makes an impact.</p>
        </div>
        
        <div style="background: #15261d; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
          <p style="color: #e8e2d6; line-height: 1.6; font-size: 16px; margin-top: 0;">We are absolutely thrilled to welcome you to the community. You have just taken the first step toward combining your passion for golf with real, tangible charitable impact.</p>
          <p style="color: #e8e2d6; line-height: 1.6; font-size: 16px;">Here is how you can start making the most of your Alfred Golf membership today:</p>
          
          <ul style="color: #e8e2d6; line-height: 1.6; font-size: 16px; padding-left: 20px;">
            <li style="margin-bottom: 12px;"><strong style="color: #c9a84c;">Log Your Scores:</strong> Head to your dashboard and enter your latest Stableford scores. Your last 5 scores are automatically entered into our monthly prize draws.</li>
            <li style="margin-bottom: 12px;"><strong style="color: #c9a84c;">Support Your Charity:</strong> A dedicated percentage of your subscription goes directly to the charity you selected. You play, they benefit.</li>
            <li style="margin-bottom: 12px;"><strong style="color: #c9a84c;">Win the Jackpot:</strong> Match all 5 numbers in our monthly draw and take home the grand prize!</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #c9a84c; color: #0e1a13; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin-top: 10px; box-shadow: 0 4px 12px rgba(201, 168, 76, 0.2);">Access Your Dashboard</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #1a2c21; margin: 40px 0 20px 0;" />
        <div style="text-align: center;">
          <p style="color: #8da396; font-size: 13px; line-height: 1.5;">If you have any questions or need assistance, simply reply to this email. We are always here to help.</p>
          <p style="color: #66786e; font-size: 12px; margin-top: 20px;">© ${new Date().getFullYear()} Alfred Golf. Play. Give. Win.</p>
        </div>
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
