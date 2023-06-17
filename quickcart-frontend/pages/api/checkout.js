import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";

const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.json("invalid request");
  }
  if (req.method === "POST") {
    const {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    } = req.body;
    await mongooseConnect();
    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];
    const productInfos = await Product.find({ _id: uniqueIds });
    const shippingFeeSetting = await Setting.findOne({ name: "shippingFee" });
    const shippingFee = parseInt(shippingFeeSetting.value || "0") * 100;

    let line_items = [];
    for (const pId of uniqueIds) {
      const pInfo = productInfos.find((p) => p._id.toString() === pId);
      const quantity = productIds.filter((id) => id === pId)?.length || 0;
      if (quantity > 0 && pInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: "USD",
            product_data: { name: pInfo.name },
            unit_amount: quantity * pInfo.price * 100,
            product_id: pInfo._id,
          },
        });
      }
    }

    const authSession = await getServerSession(req, res, authOption);

    const newOder = await Order.create({
      line_items,
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      paid: false,
      userEmail: authSession?.user?.email,
    });
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: process.env.PUBLIC_URL + "/payment?success=1",
      cancel_url: process.env.PUBLIC_URL + "/payment?canceled=1",
      metadata: { orderId: newOder._id.toString() },
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "shipping fee",
            type: "fixed_amount",
            fixed_amount: { amount: shippingFee, currency: "USD" },
          },
        },
      ],
    });
    res.json({
      url: session.url,
    });
  }
}
