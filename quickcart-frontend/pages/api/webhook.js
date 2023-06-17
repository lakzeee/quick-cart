import mongooseConnect from "@/lib/mongoose";
import { buffer } from "micro";
import { Order } from "@/models/Order";

// stripe login && stripe listen --forward-to localhost:3100/api/webhook

const stripe = require("stripe")(process.env.STRIPE_SK);
export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];
  const endpointSecret =
    "whsec_bcde6beb56e36213a61b971517d5f88872d8b9e7f601d58e75f6f9e73a269a3a";
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === "paid";
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send("ok");
}

export const config = {
  api: { bodyParser: false },
};
