import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// App Router: disable body parsing by reading raw text
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
        // Return 200 so Stripe doesn't retry — this is a data issue, not a server error
        return NextResponse.json({ received: true });
      }

      const { error: updateError } = await supabase
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

      console.log(
        `Registration ${registrationId} confirmed (session: ${session.id})`
      );
    }

    // --- 4. Return 200 for all other event types ---
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
