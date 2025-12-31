"use client";

import { useEffect, useMemo, useState } from "react";
import AppLogoutButton from "@/components/AppLogoutButton";

type LabRow = any;

const formatLabThai = (row: any) =>
  row?.LABTEST_TH || row?.LABTEST_NAME || row?.LABTEST || "-";

function safeNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toDate(raw: any) {
  if (!raw) return null;
  const s = String(raw).trim();

  // YYYYMMDD
  if (/^\d{8}$/.test(s)) {
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    const dt = new Date(`${y}-${m}-${d}T00:00:00`);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // ISO / other formats
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? null : dt;
}

// โหมดแสดงวันที่ไทย: short = 19 เม.ย. 2568, long = 19 เมษายน 2568
function formatThaiDate(raw: any, mode: "short" | "long" = "short") {
  const dt = toDate(raw);
  if (!dt) return "-";

  const locale = "th-TH";
  const options: Intl.DateTimeFormatOptions =
    mode === "long"
      ? { year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" };

  return dt.toLocaleDateString(locale, options);
}


export default function HomePage() {
  const [labs, setLabs] = useState<LabRow[]>([]);
  const [cid, setCid] = useState<string>("");
  const [person, setPerson] = useState<any>(null);
  const [userFallback, setUserFallback] = useState<{ firstName?: string; lastName?: string }>({});
  const [cvdRisk, setCvdRisk] = useState<any>(null);

  useEffect(() => {
    const rawLabs = sessionStorage.getItem("labs");
    const rawCid = sessionStorage.getItem("cid");
    const rawPerson = sessionStorage.getItem("person");
    const userFirst = sessionStorage.getItem("userFirstName") || "";
    const userLast = sessionStorage.getItem("userLastName") || "";

 // ✅ ข้อ 3: Guard - ถ้าไม่มี session สำคัญ ให้เด้งกลับหน้าแรกทันที
  if (!rawCid || !rawLabs) {
    window.location.replace("/");
    return;
  }

    setLabs(rawLabs ? JSON.parse(rawLabs) : []);
    setCid(rawCid || "");
    setPerson(rawPerson ? JSON.parse(rawPerson) : null);
    setUserFallback({ firstName: userFirst, lastName: userLast });
  }, []);

useEffect(() => {
  // ✅ ข้อ 4: ล้าง session เมื่อปิดแท็บ/รีเฟรช (เพิ่มความปลอดภัยข้อมูลสุขภาพ)
  const onUnload = () => {
    sessionStorage.removeItem("labs");
    sessionStorage.removeItem("cid");
    sessionStorage.removeItem("person");
    sessionStorage.removeItem("userFirstName");
    sessionStorage.removeItem("userLastName");
  };

  window.addEventListener("beforeunload", onUnload);
  return () => window.removeEventListener("beforeunload", onUnload);
}, [cid, person]);


  // เรียง "ล่าสุดอยู่บนสุด" เหมือนภาพ
  const labsSorted = useMemo(() => {
    const copy = [...(labs || [])];
    copy.sort((a, b) => {
      const da = toDate(a.DATE_SERV)?.getTime() ?? 0;
      const db = toDate(b.DATE_SERV)?.getTime() ?? 0;
      return db - da; // ล่าสุดก่อน
    });
    return copy;
  }, [labs]);


  const latestRow = labsSorted[0];

  // ค่าล่าสุด "น้ำตาลในเลือด" (ใน backend เดิม filter LABTEST น้ำตาลอยู่แล้ว) :contentReference[oaicite:1]{index=1}
  const latestGlucose = safeNumber(latestRow?.LABRESULT);

  // ชื่อหน่วยบริการ
  const latestHosp =
    latestRow?.HOSPNAME ||
    latestRow?.LABPLACE ||
    latestRow?.HOSPCODE ||
    "ไม่ระบุสถานพยาบาล";

  useEffect(() => {
    if (!cid) return;
    // ถ้ายังไม่มี person ลองดึงจาก API
    if (!person) {
      (async () => {
        try {
          const r = await fetch(`/api/person/${cid}`);
          const d = await r.json();
          if (d.success && d.person) setPerson(d.person);
        } catch {
          // ignore
        }
      })();
    }

    (async () => {
      try {
        const r = await fetch(`/api/cvdrisk/${cid}`);
        const d = await r.json();
        if (d.success && d.results?.length) setCvdRisk(d.results[0]);
      } catch {
        // ไม่ทำอะไร ให้ UI แสดง "..."
      }
    })();
  }, [cid]);

  if (!labsSorted.length) {
    return (
      <main className="page">
        <h1 className="title">ผลตรวจ (ล่าสุด)</h1>
        <div className="card" style={{ textAlign: "center" }}>
          ไม่พบข้อมูลการตรวจ
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <h1 className="title" style={{ margin: 0 }}>
          ผลตรวจ (ล่าสุด)
        </h1>
        <div style={{ marginLeft: "auto" }}>
          <AppLogoutButton label="ออกจากระบบแอป" variant="inline" />
        </div>
      </div>

      {/* การ์ด: รายละเอียดบุคคล (ก่อนผลตรวจ) */}
      <section className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 8px" }}>ข้อมูลผู้ใช้</h3>
        <div className="info-row">
          <div className="info-item">
            <p className="label">ชื่อ - นามสกุล</p>
            <p className="value" style={{ margin: 0 }}>
              {person?.firstName || userFallback.firstName || "-"}{" "}
              {person?.lastName || userFallback.lastName || ""}
            </p>
          </div>
          <div className="info-pair">
            <div className="info-item">
              <p className="label">เพศ</p>
              <p className="chip chip-gender" style={{ margin: 0 }}>
                {person?.gender || "-"}
              </p>
            </div>
            <div className="info-item">
              <p className="label">อายุ</p>
              <p className="chip chip-age" style={{ margin: 0 }}>
                {person?.age != null ? `${person.age} ปี` : "-"}
              </p>
            </div>
          </div>
          <div className="info-item">
            <p className="label">เลขบัตรประชาชน</p>
            <p className="value mono" style={{ margin: 0 }}>
              {cid || person?.cid || "-"}
            </p>
          </div>
        </div>
      </section>

      {/* การ์ด 1: CVD Risk */}
      <section className="card">
        <div className="bigNumber">
          {cvdRisk?.Thai_ASCVD2_Risk_percent != null
            ? Number(cvdRisk.Thai_ASCVD2_Risk_percent).toFixed(1)
            : "..."}
        </div>
        <p className="subTitle">ความเสี่ยงโรคหัวใจและหลอดเลือด (10 ปี)</p>
        <div className="muted">{cvdRisk?.Risk_Category_TH || "-"}</div>
      </section>

      {/* การ์ด 2: น้ำตาลในเลือด */}
      <section className="card">
        <div className="bigNumber">
          {latestGlucose != null ? latestGlucose : "..."}
        </div>
        <p className="subTitle">น้ำตาลในเลือด</p>
        <div className="muted">{latestHosp}</div>
      </section>

      {/* ตาราง */}
      <h2 className="sectionTitle">
        ตารางผลแล็บ (ทั้งหมด {labsSorted.length} รายการ)
      </h2>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>สถานพยาบาล</th>
              <th>รายการ</th>
              <th>ชื่อแล็บ</th>
              <th>ผล</th>
            </tr>
          </thead>

          <tbody>
            {labsSorted.map((row: any, idx: number) => (
              <tr key={`${row.CID || cid}-${idx}`}>
                <td>{formatThaiDate(row.DATE_SERV, "short")}</td>
                <td>{row.HOSPNAME || row.LABPLACE || row.HOSPCODE || "-"}</td>
                <td>{row.LABTEST || "-"}</td>
                <td>{formatLabThai(row)}</td>
                <td>
                  {safeNumber(row.LABRESULT) != null
                    ? Number(row.LABRESULT).toFixed(2)
                    : row.LABRESULT ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
