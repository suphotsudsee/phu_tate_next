"use client";

import { useEffect, useMemo, useState } from "react";

type LabRow = any;

const formatLabThai = (row: any) =>
  row?.LABTEST_TH || row?.LABTEST_NAME || row?.LABTEST || "-";

function safeNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toIsoLike(raw: any) {
  // ในภาพคุณโชว์แนวนี้: 2025-04-19T17:00:00.000Z
  // ถ้าข้อมูลเดิมเป็น YYYYMMDD หรือ date string จะพยายามแปลงเป็น ISO ให้
  if (!raw) return "-";
  const s = String(raw).trim();

  // ถ้าเป็น ISO อยู่แล้ว
  if (s.includes("T") && (s.endsWith("Z") || s.includes("."))) return s;

  // ถ้าเป็น YYYYMMDD
  if (/^\d{8}$/.test(s)) {
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    const dt = new Date(`${y}-${m}-${d}T17:00:00.000Z`);
    return isNaN(dt.getTime()) ? s : dt.toISOString();
  }

  const dt = new Date(s);
  return isNaN(dt.getTime()) ? s : dt.toISOString();
}

export default function HomePage() {
  const [labs, setLabs] = useState<LabRow[]>([]);
  const [cid, setCid] = useState<string>("");
  const [cvdRisk, setCvdRisk] = useState<any>(null);

  useEffect(() => {
    const rawLabs = sessionStorage.getItem("labs");
    const rawCid = sessionStorage.getItem("cid");
    setLabs(rawLabs ? JSON.parse(rawLabs) : []);
    setCid(rawCid || "");
  }, []);

  // เรียง "ล่าสุดอยู่บนสุด" เหมือนภาพ
  const labsSorted = useMemo(() => {
    const copy = [...(labs || [])];
    copy.sort((a, b) => {
      const da = new Date(toIsoLike(a.DATE_SERV)).getTime();
      const db = new Date(toIsoLike(b.DATE_SERV)).getTime();
      return db - da;
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
      <h1 className="title">ผลตรวจ (ล่าสุด)</h1>

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
                <td>{toIsoLike(row.DATE_SERV)}</td>
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
