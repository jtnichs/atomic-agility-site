import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import supabaseAdmin from "@/lib/supabase-admin";
import { sendRegistrationConfirmation } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// App Router: read raw body, no body parser
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // --- 1. Read raw body and signature ---
    const body = await request.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header." },
        { status: 400 }
      );
    }

    // --- 2. Verify webhook signature ---
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    // --- 3. Handle checkout.session.completed ---
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const registrationId = session.metadata?.registrationId;
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      if (!registrationId) {
        console.error("No registrationId in session metadata:", session.id);
        // Return 200 so Stripe doesn't retry — data issue, not a server error
        return NextResponse.json({ received: true });
      }

      // --- Update registration to confirmed ---
      const { error: updateError } = await supabaseAdmin
        .from("registrations")
        .update({
          status: "confirmed",
          stripe_payment_intent_id: paymentIntent,
        })
        .eq("id", registrationId);

      if (updateError) {
        console.error("Registration update error:", updateError);
        // Return 500 so Stripe retries
        return NextResponse.json(
          { error: "Failed to update registration." },
          { status: 500 }
        );
      }

      console.log(`Registration ${registrationId} confirmed (session: ${session.id})`);

      // --- Fetch full registration details for confirmation email ---
      const { data: registration, error: fetchError } = await supabaseAdmin
        .from("registrations")
        .select(`
          id,
          first_name,
          last_name,
          email,
          amount_paid_cents,
          schedules (
            start_date,
            end_date,
            courses (
              title
            )
          )
        `)
        .eq("id", registrationId)
        .single();

      if (fetchError || !registration) {
        console.error("Could not fetch registration for email:", fetchError);
        // Don't fail the webhook — registration is already confirmed
        return NextResponse.json({ received: true });
      }

      // Normalize nested joins (Supabase may return arrays)
      const scheduleRaw = Array.isArray(registration.schedules)
        ? registration.schedules[0]
        : registration.schedules;

      const courseRaw = Array.isArray(scheduleRaw?.courses)
        ? scheduleRaw.courses[0]
        : scheduleRaw?.courses;

      if (!scheduleRaw || !courseRaw) {
        console.error("Missing schedule/course data for email, registration:", registrationId);
        return NextResponse.json({ received: true });
      }

      // Format dates with T12:00:00 to avoid timezone-shift issues
      const startDate = new Date(`${scheduleRaw.start_date}T12:00:00`).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      );
      const endDate = new Date(`${scheduleRaw.end_date}T12:00:00`).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      );

      // --- Send confirmation email ---
      try {
        await sendRegistrationConfirmation({
          to: registration.email,
          firstName: registration.first_name,
          lastName: registration.last_name,
          courseTitle: courseRaw.title,
          startDate,
          endDate,
          amountPaid: registration.amount_paid_cents / 100,
          registrationId: registration.id,
        });
        console.log("Confirmation email sent to:", registration.email);
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        // Don't throw — webhook must still return 200
      }
    }

    // --- 4. Return 200 for all event types ---
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
