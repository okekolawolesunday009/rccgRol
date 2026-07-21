import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}) {
  const transporter = createTransporter();
  if (!transporter || !NOTIFY_EMAIL) return;
  const sub = data.subject
    ? `[Contact] ${data.subject} — from ${data.name}`
    : `[Contact] New Message from ${data.name}`;
  try {
    await transporter.sendMail({
      from: `"RCCG LP17 Website" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: sub,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0f172a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#f59e0b;margin:0;font-style:italic">New Contact Message</h2>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:13px">RCCG LP17 HQ — Website Inbox</p>
        </div>
        <div style="background:#1e293b;padding:32px;border-radius:0 0 12px 12px;border:1px solid #334155;border-top:none">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:100px">Name</td><td style="color:#f1f5f9;font-weight:600">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px">Email</td><td><a href="mailto:${data.email}" style="color:#f59e0b">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px">Phone</td><td style="color:#f1f5f9">${data.phone}</td></tr>` : ""}
            ${data.subject ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px">Subject</td><td style="color:#f1f5f9">${data.subject}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;padding:20px;background:#0f172a;border-radius:8px;border-left:3px solid #f59e0b">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.1em">Message</p>
            <p style="color:#e2e8f0;line-height:1.7;margin:0;white-space:pre-wrap">${data.message}</p>
          </div>
          <p style="color:#475569;font-size:12px;margin-top:24px">
            View all messages in the <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/inbox" style="color:#f59e0b">Admin Inbox</a>
          </p>
        </div>
      </div>`,
    });
  } catch (err) {
    console.error("[email] contact notification failed:", err);
  }
}

export async function sendConnectCardNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  visitorType?: string | null;
  interests?: string[] | null;
  message?: string | null;
}) {
  const transporter = createTransporter();
  if (!transporter || !NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({
      from: `"RCCG LP17 Website" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `[New Visitor] Connect Card from ${data.name}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0f172a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#f59e0b;margin:0;font-style:italic">New Connect Card Submitted</h2>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:13px">RCCG LP17 HQ — New Visitor</p>
        </div>
        <div style="background:#1e293b;padding:32px;border-radius:0 0 12px 12px;border:1px solid #334155;border-top:none">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:120px">Name</td><td style="color:#f1f5f9;font-weight:600">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px">Email</td><td><a href="mailto:${data.email}" style="color:#f59e0b">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px">Phone</td><td style="color:#f1f5f9">${data.phone}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px">Visitor Type</td><td style="color:#f1f5f9">${data.visitorType ?? "First-time visitor"}</td></tr>
          </table>
          ${data.interests && data.interests.length > 0 ? `
          <div style="margin-top:20px">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.1em">Interested In</p>
            <div>${data.interests.map((i) => `<span style="background:#1e3a5f;color:#93c5fd;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;display:inline-block;margin:3px">${i}</span>`).join("")}</div>
          </div>` : ""}
          ${data.message ? `
          <div style="margin-top:24px;padding:20px;background:#0f172a;border-radius:8px;border-left:3px solid #f59e0b">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.1em">Message / Prayer Request</p>
            <p style="color:#e2e8f0;line-height:1.7;margin:0;white-space:pre-wrap">${data.message}</p>
          </div>` : ""}
          <p style="color:#475569;font-size:12px;margin-top:24px">
            View all connect cards in the <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/inbox" style="color:#f59e0b">Admin Inbox</a>
          </p>
        </div>
      </div>`,
    });
  } catch (err) {
    console.error("[email] connect card notification failed:", err);
  }
}
