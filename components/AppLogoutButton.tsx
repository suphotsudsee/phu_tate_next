"use client";

import { useRouter } from "next/navigation";

type Props = {
  label?: string;
};

export default function AppLogoutButton({ label = "ออกจากระบบ" }: Props) {
  const router = useRouter();

  const appLogout = () => {
    const ok = confirm("ต้องการออกจากระบบแอปหรือไม่?");
    if (!ok) return;

    // 1) เคลียร์เฉพาะข้อมูลแอป (คุณเพิ่ม key อื่นได้)
    try {
      sessionStorage.removeItem("labs");
      sessionStorage.removeItem("cid");

      // ถ้าคุณเคยเก็บอะไรใน localStorage เกี่ยวกับ auth
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
    } catch {}

    // 2) กันกด back แล้วกลับเข้าหน้าเดิม:
    // replace จะไม่เพิ่ม history ใหม่
    router.replace("/");

    // 3) บังคับ refresh state (แน่นอน 100%)
    router.refresh();
  };

  return (
    <button
      onClick={appLogout}
      style={{
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
      }}
      aria-label="Logout app"
      title="ออกจากระบบแอป (ไม่ออกจาก LINE)"
    >
      {label}
    </button>
  );
}
