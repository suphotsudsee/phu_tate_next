"use client";

import { useEffect, useMemo, useState } from "react";

type LabRow = any;

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

  const filteredData = useMemo(() => {
    const parseDate = (raw: any) => {
      if (!raw) return null;
      const str = String(raw).trim();
      if (str.length === 8 && /^\d{8}$/.test(str)) {
        const y = str.slice(0, 4);
        const m = str.slice(4, 6);
        const d = str.slice(6, 8);
        const dt = new Date(`${y}-${m}-${d}`);
        return Number.isNaN(dt.getTime()) ? null : dt;
      }
      const dt = new Date(str);
      return Number.isNaN(dt.getTime()) ? null : dt;
    };

    return (labs || [])
      .map((item) => {
        const parsed = parseDate(item.DATE_SERV);
        if (!parsed) return null;
        return {
          date: parsed.toISOString().split("T")[0],
          labResult: parseFloat(item.LABRESULT) || 0,
          hospname:
            item.HOSPNAME || item.hospname || item.LABPLACE || item.HOSPCODE || "ไม่ระบุสถานพยาบาล",
          originalItem: item,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);
  }, [labs]);

  useEffect(() => {
    if (!cid) return;
    (async () => {
      try {
        const r = await fetch(`/api/cvdrisk/${cid}`);
        const d = await r.json();
        if (d.success && d.results?.length) setCvdRisk(d.results[0]);
      } catch {}
    })();
  }, [cid]);

  if (!labs?.length) {
    return (
      <main style={{ padding: 20, textAlign: "center" }}>
        <h3>ไม่พบข้อมูลการตรวจ</h3>
        <p>กรุณากลับไปหน้าแรกแล้วทำการยืนยันตัวตน</p>
      </main>
    );
  }

  const latest = filteredData[filteredData.length - 1];

  return (
    <main style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2>ผลตรวจ (ล่าสุด)</h2>

      <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          {cvdRisk ? Number(cvdRisk.Thai_ASCVD2_Risk_percent).toFixed(1) : "..."}
        </div>
        <div>ความเสี่ยงโรคหัวใจและหลอดเลือด (10 ปี)</div>
        <div style={{ color: "#666", marginTop: 6 }}>
          {cvdRisk?.Risk_Category_TH || "-"}
        </div>
      </section>

      <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{latest?.labResult ?? "-"}</div>
        <div>น้ำตาลในเลือด</div>
        <div style={{ color: "#666", marginTop: 6 }}>{latest?.hospname}</div>
      </section>

      <h3>ตารางผลแล็บ (ทั้งหมด {labs.length} รายการ)</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>วันที่</th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>สถานพยาบาล</th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>รายการ</th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>ชื่อแล็บ</th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>ผล</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((row: any, idx: number) => (
              <tr key={`${row.CID || cid}-${idx}`}>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.DATE_SERV || "-"}</td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.HOSPNAME || row.LABPLACE || row.HOSPCODE || "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.LABTEST || "-"}</td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.LABTEST_TH || row.LABTEST_NAME || row.LABTEST || "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.LABRESULT || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
