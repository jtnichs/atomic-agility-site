import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import supabaseAdmin from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Verify cron secret
  const secret = request.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Pending = status pending, no payment intent, older than 24 hours
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: pending, error } = await supabaseAdmin
    .from("registrations")
    .select(`
      id,
      first_name,
      last_name,
      email,
      company,
      job_title,
      created_at,
      schedules (
        start_date,
        end_date,
        courses (
          title
        )
      )
    `)
    .eq("status", "pending")
    .is("stripe_payment_intent_id", null)
    .is("admin_alerted_at", null)
    .lt("created_at", cutoff);

  if (error) {
    console.error("Pending alert query failed:", error);
    return NextResponse.json({ error: "Query failed", details: error }, { status: 500 });
  }

  if (!pending || pending.length === 0) {
    console.log("Pending alert: no stale pending registrations found");
    return NextResponse.json({ message: "No pending registrations" });
  }

  const rows = pending
    .map((r) => {
      const scheduleRaw = Array.isArray(r.schedules) ? r.schedules[0] : r.schedules;
      const courseRaw = scheduleRaw
        ? Array.isArray(scheduleRaw.courses)
          ? scheduleRaw.courses[0]
          : scheduleRaw.courses
        : null;
      const registeredAt = new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/New_York" });
      return `
        <tr>
          <td style="padding:6px 12px">${r.first_name} ${r.last_name}</td>
          <td style="padding:6px 12px">${r.email}</td>
          <td style="padding:6px 12px">${r.company}</td>
          <td style="padding:6px 12px">${(courseRaw as { title?: string } | null)?.title ?? "—"}</td>
          <td style="padding:6px 12px">${registeredAt} ET</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <h2 style="font-family:sans-serif">Pending Registrations — ${pending.length} awaiting payment</h2>
    <table border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <thead style="background:#f1f5f9">
        <tr>
          <th style="padding:8px 12px;text-align:left">Name</th>
          <th style="padding:8px 12px;text-align:left">Email</th>
          <th style="padding:8px 12px;text-align:left">Company</th>
          <th style="padding:8px 12px;text-align:left">Course</th>
          <th style="padding:8px 12px;text-align:left">Registered At</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-family:sans-serif;color:#64748b;margin-top:16px">
      These registrations have been pending for more than 24 hours with no payment completed.
    </p>
  `;

  const { error: emailError } = await resend.emails.send({
    from: "john@atomicagility.us",
    to: "john@atomicagility.us",
    subject: `Pending Registrations Alert — ${pending.length} awaiting payment`,
    html,
  });

  if (emailError) {
    console.error("Pending alert email failed:", emailError);
    return NextResponse.json({ error: "Email send failed", details: emailError }, { status: 500 });
  }

  // Mark all alerted registrations so they are not re-alerted on future cron runs
  const alertedIds = pending.map((r) => r.id);
  const { error: updateError } = await supabaseAdmin
    .from("registrations")
    .update({ admin_alerted_at: new Date().toISOString() })
    .in("id", alertedIds);

  if (updateError) {
    // Alert was sent — log the error but don't fail the response
    console.error("Failed to mark registrations as alerted:", updateError);
  }

  console.log(`Pending alert sent: ${pending.length} stale registrations`);

  return NextResponse.json({ message: `Alert sent for ${pending.length} registrations` });
}
