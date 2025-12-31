"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!LIFF_ID) throw new Error("Missing NEXT_PUBLIC_LIFF_ID");

        await liff.init({ liffId: LIFF_ID, withLoginOnExternalBrowser: true });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const p = await liff.getProfile();
        setProfile(p);

        // auto login
        const r = await fetch("/api/line-auto-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineUserId: p.userId }),
        });
        const d = await r.json();

        if (d.success) {
          // เก็บข้อมูลไว้ใช้ที่หน้า /home (แทน react-router state เดิม)
          sessionStorage.setItem("labs", JSON.stringify(d.labs || []));
          sessionStorage.setItem("cid", String(d.user?.idNumber || ""));
          sessionStorage.setItem("person", JSON.stringify(d.person || null));
          sessionStorage.setItem("userFirstName", d.user?.firstName || "");
          sessionStorage.setItem("userLastName", d.user?.lastName || "");
          router.push("/home");
        }
      } catch (e: any) {
        setErr(e?.message || String(e));
      } finally {
        setInitializing(false);
      }
    })();
  }, [router]);

  const submit = async () => {
    if (!profile?.userId) {
      alert("ไม่พบข้อมูล LINE กรุณารีเฟรช");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber: cid,
          lineUserId: profile.userId,
          lineDisplayName: profile.displayName,
        }),
      });
      const d = await r.json();
      if (!d.success) {
        alert("ไม่พบข้อมูล หรือเลขบัตรไม่ถูกต้อง");
        return;
      }
      sessionStorage.setItem("labs", JSON.stringify(d.labs || []));
      sessionStorage.setItem("cid", String(d.user?.idNumber || cid));
      sessionStorage.setItem("person", JSON.stringify(d.person || null));
      sessionStorage.setItem("userFirstName", d.user?.firstName || "");
      sessionStorage.setItem("userLastName", d.user?.lastName || "");
      router.push("/home");
    } catch {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  if (err) {
    return (
      <main style={{ padding: 20 }}>
        <h3>เกิดข้อผิดพลาดในการเชื่อมต่อ LINE</h3>
        <pre>{err}</pre>
      </main>
    );
  }

  if (initializing) {
    return (
      <main style={{ padding: 20, textAlign: "center" }}>
        <p>กำลังเตรียมข้อมูล LINE...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <h2>เชื่อมต่อบัญชี</h2>
      <p style={{ fontSize: 14, color: "#666" }}>
        กรุณากรอกเลขบัตรประชาชน 13 หลัก เพื่อผูกกับ LINE ของคุณ
      </p>

      {profile && (
        <div style={{ marginBottom: 12, padding: 10, background: "#f6f6f6" }}>
          <strong>ผู้ใช้งาน:</strong> {profile.displayName}
        </div>
      )}

      <label>เลขบัตรประชาชน</label>
      <input
        value={cid}
        onChange={(e) => setCid(e.target.value.replace(/\D/g, "").slice(0, 13))}
        inputMode="numeric"
        maxLength={13}
        style={{ width: "100%", padding: 10, margin: "8px 0 12px" }}
        placeholder="ระบุตัวเลข 13 หลัก"
      />

      <button
        onClick={submit}
        disabled={loading || cid.length !== 13}
        style={{ width: "100%", padding: 10 }}
      >
        {loading ? "กำลังบันทึก..." : "ยืนยันตัวตน"}
      </button>
    </main>
  );
}
