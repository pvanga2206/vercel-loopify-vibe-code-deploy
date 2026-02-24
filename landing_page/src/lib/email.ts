interface Reminder {
  contact: { name: string; company: string | null; role: string | null }
  message: string | null
  dueDate: string
}

function isOverdueDate(date: string): boolean {
  return new Date(date) < new Date(new Date().toDateString())
}

export function buildDailyDigestEmail(userName: string, reminders: Reminder[]): string {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const overdue = reminders.filter((r) => isOverdueDate(r.dueDate))
  const dueToday = reminders.filter((r) => !isOverdueDate(r.dueDate))

  const reminderRows = (items: Reminder[], label: string, color: string) =>
    items.length === 0
      ? ''
      : `
        <div style="margin-bottom:24px;">
          <h3 style="margin:0 0 12px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${color};">
            ${label} (${items.length})
          </h3>
          ${items
            .map(
              (r) => `
            <div style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#f1f5f9;">${r.contact.name}</p>
                  <p style="margin:0;font-size:13px;color:#94a3b8;">
                    ${r.contact.role ? r.contact.role + ' · ' : ''}${r.contact.company || ''}
                  </p>
                  ${r.message ? `<p style="margin:8px 0 0;font-size:13px;color:#cbd5e1;font-style:italic;">"${r.message}"</p>` : ''}
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      `

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Loopify Daily Digest</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:32px;height:32px;background:#4c6ef5;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;">L</div>
                <span style="font-size:22px;font-weight:700;color:#f1f5f9;">Loopify</span>
              </div>
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background:#12121a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">${today}</p>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">Good morning, ${userName}! ☀️</h1>
              <p style="margin:0;font-size:15px;color:#94a3b8;line-height:1.6;">
                You have <strong style="color:#f1f5f9;">${reminders.length} follow-up${reminders.length !== 1 ? 's' : ''}</strong> waiting for you today.
                Don't let the opportunity go cold.
              </p>
            </td>
          </tr>

          <tr><td style="height:20px;"></td></tr>

          <!-- Reminder sections -->
          <tr>
            <td style="background:#12121a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;">
              ${reminderRows(overdue, '⚠️ Overdue', '#f87171')}
              ${reminderRows(dueToday, '📅 Due Today', '#fbbf24')}
              ${reminders.length === 0
                ? '<p style="text-align:center;color:#64748b;font-size:15px;">You\'re all caught up — no follow-ups due today! 🎉</p>'
                : ''}
            </td>
          </tr>

          <tr><td style="height:20px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td style="text-align:center;">
              <a href="https://loopify.vercel.app/dashboard/reminders"
                style="display:inline-block;background:#4c6ef5;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;box-shadow:0 4px 16px rgba(76,110,245,0.35);">
                Open Dashboard →
              </a>
            </td>
          </tr>

          <tr><td style="height:32px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
              <p style="margin:0;font-size:12px;color:#475569;">
                Loopify · Follow-Up & Networking Reminder Engine<br/>
                <a href="https://loopify.vercel.app/dashboard/settings" style="color:#4c6ef5;text-decoration:none;">Manage notifications</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
