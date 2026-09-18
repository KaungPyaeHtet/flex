import { NextResponse } from "next/server";
import { addSubscription, removeSubscription } from "@/lib/push/subscriptions";

export async function POST(req: Request) {
  const sub = await req.json();
  if (!sub?.endpoint) return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
  addSubscription(sub);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { endpoint } = await req.json();
  if (endpoint) removeSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
