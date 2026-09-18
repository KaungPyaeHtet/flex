// Client-side Web Push helpers with real feature detection — including the
// iOS requirement (Home Screen install, verified during development,
// September 2026) that a timer-in-a-tab cannot substitute for. See
// WRITEUP.md "Offline & notifications" for the full disclosure.

export type PushSupport =
  | { supported: true }
  | { supported: false; reason: "no-service-worker" | "no-push-manager" | "ios-not-installed" };

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // Safari's non-standard flag for "added to Home Screen"
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function checkPushSupport(): PushSupport {
  if (!("serviceWorker" in navigator)) return { supported: false, reason: "no-service-worker" };
  if (!("PushManager" in window)) return { supported: false, reason: "no-push-manager" };
  if (isIos() && !isStandalone()) return { supported: false, reason: "ios-not-installed" };
  return { supported: true };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  const support = checkPushSupport();
  if (!support.supported) return { ok: false, error: support.reason };

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) return { ok: false, error: "not-configured" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, error: "permission-denied" };

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
  });

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  return { ok: res.ok };
}
