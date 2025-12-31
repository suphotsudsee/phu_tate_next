export async function initLiff() {
  if (typeof window === "undefined") return null;

  const liff = (await import("@line/liff")).default;
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
  await liff.init({ liffId, withLoginOnExternalBrowser: true });

  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
    return null;
  }

  return liff.getProfile();
}
