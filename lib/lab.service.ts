import { db, db4 } from "./db";

export async function fetchLabByCid(cid: string) {
  if (!cid) return [];

  const sql = `
    SELECT
      p.CID,
      lf.PID,
      lf.DATE_SERV,
      lf.LABTEST,
      COALESCE(ct.TH, ct.EN) AS LABTEST_NAME,
      lf.LABRESULT,
      lf.D_UPDATE,
      lf.HOSPCODE,
      lf.LABPLACE,
      h.hosname AS HOSPNAME
    FROM person AS p
    JOIN labfu AS lf
      ON lf.HOSPCODE = p.HOSPCODE
      AND lf.PID = p.PID
    JOIN chospital AS h
      ON h.hoscode = lf.HOSPCODE
    LEFT JOIN clabtest_new AS ct
      ON ct.code = TRIM(lf.LABTEST)
      OR ct.old_code = TRIM(lf.LABTEST)
    WHERE p.CID = ?
      
    ORDER BY lf.DATE_SERV DESC
    LIMIT 20;
  `;

  const [rows] = await db4.query(sql, [cid]);
  return rows as any[];
}

export async function fetchLabByPid(hospcode: string, pid: string) {
  if (!hospcode || !pid) return [];

  const sql = `
    SELECT 
      l.HOSPCODE,
      l.PID,
      l.DATE_SERV,
      l.LABTEST,
      COALESCE(ct.TH, ct.EN) AS LABTEST_NAME,
      ct.TH AS LABTEST_TH,
      ct.EN AS LABTEST_EN,
      ct.old_code AS LABTEST_OLD_CODE,
      l.LABRESULT,
      l.LABPLACE,
      h.hosname AS HOSPNAME
    FROM labfu l
    LEFT JOIN clabtest_new AS ct
      ON ct.code = TRIM(l.LABTEST)
      OR ct.old_code = TRIM(l.LABTEST)
    LEFT JOIN chospital AS h
      ON h.hospcode = l.HOSPCODE
    WHERE l.HOSPCODE = ? AND l.PID = ?
    ORDER BY l.DATE_SERV DESC 
    LIMIT 20;
  `;

  const [rows] = await db4.query(sql, [hospcode, pid]);
  return rows as any[];
}

export async function fetchPersonFromHDC(cid: string) {
  if (!cid) return null;
  const sql = `SELECT CID, NAME, LNAME, HOSPCODE, PID FROM t_person_cid WHERE CID = ? LIMIT 1`;
  const [rows] = await db4.query(sql, [cid]);
  const r = rows as any[];
  return r.length > 0 ? r[0] : null;
}

export async function fetchPersonDetail(cid: string) {
  if (!cid) return null;
  // primary: t_person (มีเพศ/วันเกิด)
  const sqlPerson = `
    SELECT CID, NAME, LNAME, SEX, BIRTH
    FROM t_person_cid
    WHERE CID = ?
    LIMIT 1
  `;
  let p: any = null;
  try {
    const [rowsPerson] = await db4.query(sqlPerson, [cid]);
    const rPerson = rowsPerson as any[];
    p = rPerson[0];
  } catch (e: any) {
    // ถ้าตาราง t_person ไม่มี ให้ไป fallback ทันที
    if (e?.code !== "ER_NO_SUCH_TABLE") {
      throw e;
    }
  }

  // fallback: t_person_cid (ไม่มีเพศ/วันเกิด)
  if (!p) {
    const [rowsCid] = await db4.query(
      `SELECT CID, NAME, LNAME FROM t_person_cid WHERE CID = ? LIMIT 1`,
      [cid]
    );
    const rCid = rowsCid as any[];
    p = rCid[0];
    if (!p) return null;
    return {
      cid: p.CID,
      firstName: p.NAME,
      lastName: p.LNAME,
      gender: "ไม่ทราบ",
      birthDate: null,
      age: null,
    };
  }

  const birthRaw = p.BIRTH;
  let birth: Date | null = null;
  if (typeof birthRaw === "string" && /^\d{8}$/.test(birthRaw.trim())) {
    // handle YYYYMMDD
    const s = birthRaw.trim();
    birth = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T00:00:00`);
  } else if (birthRaw) {
    const d = new Date(birthRaw);
    birth = isNaN(d.getTime()) ? null : d;
  }
  const age = birth
    ? Math.floor((Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  let gender = "ไม่ทราบ";
  if (p.SEX === "1" || p.SEX === 1) gender = "ชาย";
  else if (p.SEX === "2" || p.SEX === 2) gender = "หญิง";

  return {
    cid: p.CID,
    firstName: p.NAME,
    lastName: p.LNAME,
    gender,
    birthDate: p.BIRTH,
    age,
  };
}

export async function autoLoginByLineUserId(lineUserId: string) {
  if (!lineUserId) return { success: false };

  // local users
  const userSql = "SELECT * FROM users WHERE line_user_id = ?";
  const [users] = await db.query(userSql, [lineUserId]);
  const u = users as any[];
  if (u.length === 0) return { success: false, message: "User not found" };

  const user = u[0];
  const idNumber = String(user.id_number || "").trim();

  // labs by CID
  let labResults = await fetchLabByCid(idNumber);

  const person = await fetchPersonDetail(idNumber);

  // fallback -> HDC person -> labs by PID
  if (labResults.length === 0) {
    const hdcPerson = await fetchPersonFromHDC(idNumber);
    if (hdcPerson) {
      labResults = await fetchLabByPid(hdcPerson.HOSPCODE, hdcPerson.PID);
      // update name in local db (เหมือนเดิม)
      await db.query(
        "UPDATE users SET first_name = ?, last_name = ? WHERE id_number = ?",
        [hdcPerson.NAME, hdcPerson.LNAME, idNumber]
      );
    }
  }

  return {
    success: true,
    user: {
      idNumber,
      firstName: user.first_name,
      lastName: user.last_name,
    },
    person,
    labs: labResults,
  };
}

export async function bindCidToLineLogin(payload: {
  idNumber: string;
  lineUserId?: string;
  lineDisplayName?: string;
}) {
  const idNumber = String(payload.idNumber || "").trim();
  if (!idNumber) return { success: false };

  const hdcPerson = await fetchPersonFromHDC(idNumber);

  const firstName = hdcPerson ? hdcPerson.NAME : (payload.lineDisplayName || "LINE User");
  const lastName = hdcPerson ? hdcPerson.LNAME : "";

  const upsertSql = `
    INSERT INTO users (id_number, line_user_id, first_name, last_name, phone, password)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      line_user_id = VALUES(line_user_id),
      first_name = VALUES(first_name), 
      last_name = VALUES(last_name)
  `;
  await db.query(upsertSql, [
    idNumber,
    payload.lineUserId || null,
    firstName,
    lastName,
    "-",
    "LINE_LOGIN",
  ]);

  let labResults = await fetchLabByCid(idNumber);
  if (labResults.length === 0 && hdcPerson) {
    labResults = await fetchLabByPid(hdcPerson.HOSPCODE, hdcPerson.PID);
  }

  return {
    success: true,
    user: { idNumber, firstName, lastName },
    labs: labResults,
  };
}

// NOTE: endpoint เดิม Person.js เรียก /cvdrisk/:cid :contentReference[oaicite:5]{index=5}
// ใน server.js ที่คุณอัปโหลด snippet ยังไม่โชว์ส่วนนี้ครบ ผมทำให้เป็น “พร้อมแก้ชื่อ table”
// คุณปรับ SQL ให้ตรงฐานจริงได้ทันที
export async function fetchCvdRisk(cid: string) {
  if (!cid) return { success: false, results: [] };

  // ✅ ตัวอย่าง: ถ้าคุณมี table เช่น cvd_risk หรือ thai_ascvd_result ให้แก้ที่นี่
  const sql = `
    SELECT *
    FROM cvd_risk
    WHERE CID = ?
    ORDER BY REF_DATE DESC
    LIMIT 1
  `;

  try {
    const [rows] = await db4.query(sql, [cid]);
    const r = rows as any[];
    return { success: true, results: r };
  } catch (e: any) {
    // ถ้ายังไม่มี table นี้ จะ error -> ส่งกลับให้ frontend ขึ้น "..."
    return { success: false, results: [], message: e?.message || "cvdrisk query failed" };
  }
}
