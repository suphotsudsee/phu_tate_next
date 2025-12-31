"use client";

import { useEffect, useState } from "react";
import { initLiff } from "@/lib/liff";

export default function HomePage() {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const liff = await initLiff();
        if (!liff) return;

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        setDisplayName(profile.displayName);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <h1>Phu Tate (LIFF)</h1>
      <p>สวัสดี: {displayName || "-"}</p>
    </main>
  );
}
