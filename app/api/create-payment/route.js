import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { amount } = await request.json()
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
