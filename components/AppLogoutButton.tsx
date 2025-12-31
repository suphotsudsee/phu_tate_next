"use client";

import { useRouter } from "next/navigation";
import { initLiff } from "@/lib/liff";

type Props = {
  label?: string;
  variant?: "floating" | "inline";
};

export default function AppLogoutButton({
  label = "ออกจากระบบ",
  variant = "floating",
}: Props) {
  const router = useRouter();

  const appLogout = async () => {
    const ok = confirm("ต้องการออกจากระบบแอปหรือไม่?");
    if (!ok) return;

    // 1) เคลียร์เฉพาะข้อมูลแอป (คุณเพิ่ม key อื่นได้)
    try {
      sessionStorage.removeItem("labs");
      sessionStorage.removeItem("cid");
      sessionStorage.removeItem("person");
      sessionStorage.removeItem("userFirstName");
      sessionStorage.removeItem("userLastName");

      // ถ้าคุณเคยเก็บอะไรใน localStorage เกี่ยวกับ auth
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
    } catch {}

    // 2) ออกจาก LINE LIFF และปิดหน้าต่าง (ถ้าอยู่ใน LINE)
    try {
      const liff = await initLiff();
      if (liff) {
        liff.logout();
        if (liff.isInClient()) {
          liff.closeWindow();
          return;
        }
      }
    } catch {
      // ignore แล้วทำ fallback router ต่อ
    }

    // 3) กันกด back แล้วกลับเข้าหน้าเดิม:
    // replace จะไม่เพิ่ม history ใหม่
    router.replace("/");

    // 4) บังคับ refresh state (แน่นอน 100%)
    router.refresh();
  };

  return (
    <button
      onClick={appLogout}
      style={
        variant === "floating"
          ? {
              position: "fixed",
              top: 12,
              right: 12,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              zIndex: 1000,
              boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
            }
          : {
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
            }
      }
      aria-label="Logout app"
      title="ออกจากระบบแอป (ไม่ออกจาก LINE)"
    >
      {label}
    </button>
  );
}
