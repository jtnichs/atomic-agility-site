import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import supabaseAdmin from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// --- Types ---

interface CourseData {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
}

interface ScheduleData {
  id: string;
  price_cents: number;
  start_date: string;
  end_date: string;
  courses: CourseData | CourseData[];
}

// --- Helpers ---

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${e.getDate()}, ${e.getFullYear()}`;
  }
  const opts: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

function normalizeCourse(raw: CourseData | CourseData[]): CourseData {
  return Array.isArray(raw) ? raw[0] : raw;
}

// --- POST /api/checkout ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scheduleId,
      firstName,
      lastName,
      email,
      organization,
      jobTitle,
      hearAboutUs,
    } = body as {
      scheduleId: string;
      firstName: string;
      lastName: string;
      email: string;
      organization: string;
      jobTitle: string;
      hearAboutUs?: string;
    };

    console.log("Checkout route hit");
    console.log("Request body:", { scheduleId, firstName, lastName, email, organization, jobTitle });

    // --- Validate required fields ---
    if (!scheduleId || !firstName || !lastName || !email || !organization || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // --- 1. Fetch schedule + course from Supabase ---
    const { data: scheduleRaw, error: scheduleError } = await supabaseAdmin
      .from("schedules")
      .select("id, price_cents, start_date, end_date, courses(id, title, slug, price_cents)")
      .eq("id", scheduleId)
      .single();

    console.log("Schedule fetch result:", { data: scheduleRaw, error: scheduleError });

    if (scheduleError || !scheduleRaw) {
      return NextResponse.json(
        { error: "Schedule fetch failed", details: scheduleError },
        { status: 400 }
      );
    }

    const schedule = scheduleRaw as ScheduleData;
    const course = normalizeCourse(schedule.courses);
    const formattedDates = formatDateRange(schedule.start_date, schedule.end_date);
    const unitAmount = schedule.price_cents ?? course.price_cents;

    // --- 2. Insert pending registration ---
    const { data: registration, error: registrationError } = await supabaseAdmin
      .from("registrations")
      .insert({
        schedule_id: scheduleId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        company: organization,
        job_title: jobTitle,
        hear_about_us: hearAboutUs ?? null,
        status: "pending",
        amount_paid_cents: unitAmount,
      })
      .select("id")
      .single();

    console.log("Registration insert result:", { data: registration, error: registrationError });

    if (registrationError || !registration) {
      return NextResponse.json(
        { error: "Registration insert failed", details: registrationError },
        { status: 400 }
      );
    }

    // --- 2b. Fire admin notification email (non-blocking) ---
    resend.emails.send({
      from: "john@atomicagility.us",
      to: "john@atomicagility.us",
      subject: `New Registration Started — ${firstName} ${lastName}`,
      html: `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${organization}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>Course:</strong> ${course.title}</p>
        <p><strong>Session Dates:</strong> ${formattedDates}</p>
        <p><strong>How They Heard About Us:</strong> ${hearAboutUs ?? "Not provided"}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <hr />
        <p><em>Status: Pending — payment not yet completed</em></p>
      `,
    }).catch((err: unknown) => console.error("Admin notification email failed:", err));

    // --- 3. Create Stripe Checkout Session ---
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.atomicagility.us";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: `${formattedDates} | Virtual | 9:00 AM – 5:00 PM ET | Includes exam, office hours, AI toolkit`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: registration.id,
        scheduleId: scheduleId,
        firstName: firstName,
        lastName: lastName,
      },
      success_url: `${siteUrl}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/training/${course.slug}?cancelled=true`,
      payment_intent_data: {
        description: `Atomic Agility — ${course.title}`,
        metadata: {
          registrationId: registration.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
      },
    });

    console.log("Stripe session result:", { url: session.url });

    // --- 4. Return Stripe checkout URL ---
    return NextResponse.json({ url: session.url });

  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    console.error("Checkout route error:", error);
    return NextResponse.json(
      { error: err.message ?? "Unknown error", stack: err.stack },
      { status: 500 }
    );
  }
}
