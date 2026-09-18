// Ephemeral, in-process subscription store — intentionally not a database.
// This app collects nothing beyond a browser Push subscription object (no
// account, no PII) and it is held in memory only, for the life of the dev/
// demo server process; restarting the server clears it. See WRITEUP.md
// "Privacy" for why this scope was chosen over standing up real storage.

import type { PushSubscription as WebPushSubscription } from "web-push";

const subscriptions = new Map<string, WebPushSubscription>();

export function addSubscription(sub: WebPushSubscription) {
  subscriptions.set(sub.endpoint, sub);
}

export function removeSubscription(endpoint: string) {
  subscriptions.delete(endpoint);
}

export function allSubscriptions(): WebPushSubscription[] {
  return [...subscriptions.values()];
}
