import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReply({ to, toName, subject, body, submissionId }) {
  return resend.emails.send({
    from: 'Salam Small Goods <noreply@salamsmallgoods.com.au>',
    to: [to],
    subject: subject || 'Re: Your enquiry to Salam Small Goods',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #CC3A20; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">Salam Small Goods</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">Premium Halal Meats & Smallgoods</p>
        </div>
        <div style="background: #FBF0DC; padding: 32px; border-radius: 0 0 12px 12px; border: 2px solid #E8C098; border-top: none;">
          <p style="color: #5A3020; font-size: 15px; margin: 0 0 16px;">Hi ${toName},</p>
          <div style="color: #2A0D04; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${body}</div>
          <hr style="border: none; border-top: 1px solid #E8C098; margin: 28px 0;" />
          <p style="color: #7A5040; font-size: 13px; margin: 0;">
            Salam Small Goods · 42 Mercer Street, Broadmeadows VIC 3047<br>
            <a href="mailto:hello@salamsmallgoods.com.au" style="color: #CC3A20;">hello@salamsmallgoods.com.au</a>
          </p>
        </div>
      </div>
    `,
  });
}
