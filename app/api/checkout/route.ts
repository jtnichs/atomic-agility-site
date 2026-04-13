import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

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

    // --- Validate required fields ---
    if (!scheduleId || !firstName || !lastName || !email || !organization || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // --- 1. Fetch schedule + course from Supabase ---
    const { data: scheduleRaw, error: scheduleError } = await supabase
      .from("schedules")
      .select("id, price_cents, start_date, end_date, courses(id, title, slug, price_cents)")
      .eq("id", scheduleId)
      .single();

    if (scheduleError || !scheduleRaw) {
      console.error("Schedule fetch error:", scheduleError);
      return NextResponse.json(
        { error: "Schedule not found." },
        { status: 404 }
      );
    }

    const schedule = scheduleRaw as ScheduleData;
    const course = normalizeCourse(schedule.courses);
    const formattedDates = formatDateRange(schedule.start_date, schedule.end_date);
    const unitAmount = schedule.price_cents ?? course.price_cents;

    // --- 2. Insert pending registration ---
    const { data: registration, error: regError } = await supabase
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

    if (regError || !registration) {
      console.error("Registration insert error:", regError);
      return NextResponse.json(
        { error: "Could not create registration. Please try again." },
        { status: 500 }
      );
    }

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

    // --- 4. Return Stripe checkout URL ---
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
