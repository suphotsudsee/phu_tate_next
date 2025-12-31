"use client";

import { useEffect, useState } from "react";
import { initLiff } from "@/lib/liff";

type PersonData = {
  cid?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: number | null;
};

export default function PersonView() {
  const [person, setPerson] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const liff = await initLiff();
        if (!liff) return;

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const profile = await liff.getProfile();
        const res = await fetch("/api/line-auto-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineUserId: profile.userId }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
        }

        const p = data.person || {};
        const fallbackName = {
          firstName: data.user?.firstName,
          lastName: data.user?.lastName,
        };

        if (active) {
          setPerson({
            cid: p.cid || data.user?.idNumber,
            firstName: p.firstName || fallbackName.firstName,
            lastName: p.lastName || fallbackName.lastName,
            gender: p.gender,
            age: p.age ?? null,
          });
        }
      } catch (e: any) {
        if (active) setError(e?.message || "เกิดข้อผิดพลาด");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="home-wrap">
      <div className="home-hero">
        <div className="badge">ข้อมูลผู้ใช้</div>
        <h1>ยินดีต้อนรับกลับ</h1>
        <p>แสดงข้อมูลจากตาราง t_person พร้อมสีสันที่สดใส</p>
      </div>

      <section className="card">
        {loading && <p className="muted">กำลังโหลด...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && person && (
          <div className="grid">
            <div>
              <p className="label">ชื่อ - นามสกุล</p>
              <p className="value">
                {person.firstName || "-"} {person.lastName || ""}
              </p>
            </div>
            <div>
              <p className="label">เพศ</p>
              <p className="chip chip-gender">{person.gender || "-"}</p>
            </div>
            <div>
              <p className="label">อายุ</p>
              <p className="chip chip-age">
                {person.age != null ? `${person.age} ปี` : "-"}
              </p>
            </div>
            <div>
              <p className="label">เลขบัตรประชาชน</p>
              <p className="value mono">{person.cid || "-"}</p>
            </div>
          </div>
        )}

        {!loading && !error && !person && (
          <p className="muted">ไม่พบข้อมูลผู้ใช้</p>
        )}
      </section>
    </main>
  );
}
