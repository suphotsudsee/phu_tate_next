"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.fetchCvdRisk = exports.bindCidToLineLogin = exports.autoLoginByLineUserId = exports.fetchPersonDetail = exports.fetchPersonFromHDC = exports.fetchLabByPid = exports.fetchLabByCid = void 0;
var db_1 = require("./db");
function fetchLabByCid(cid) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cid)
                        return [2 /*return*/, []];
                    sql = "\n    SELECT\n      p.CID,\n      lf.PID,\n      lf.DATE_SERV,\n      lf.LABTEST,\n      COALESCE(ct.TH, ct.EN) AS LABTEST_NAME,\n      lf.LABRESULT,\n      lf.D_UPDATE,\n      lf.HOSPCODE,\n      lf.LABPLACE,\n      h.hosname AS HOSPNAME\n    FROM person AS p\n    JOIN labfu AS lf\n      ON lf.HOSPCODE = p.HOSPCODE\n      AND lf.PID = p.PID\n    JOIN chospital AS h\n      ON h.hoscode = lf.HOSPCODE\n    LEFT JOIN clabtest_new AS ct\n      ON ct.code = TRIM(lf.LABTEST)\n      OR ct.old_code = TRIM(lf.LABTEST)\n    WHERE p.CID = ?\n      \n    ORDER BY lf.DATE_SERV DESC\n    LIMIT 20;\n  ";
                    return [4 /*yield*/, db_1.db4.query(sql, [cid])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.fetchLabByCid = fetchLabByCid;
function fetchLabByPid(hospcode, pid) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!hospcode || !pid)
                        return [2 /*return*/, []];
                    sql = "\n    SELECT \n      l.HOSPCODE,\n      l.PID,\n      l.DATE_SERV,\n      l.LABTEST,\n      COALESCE(ct.TH, ct.EN) AS LABTEST_NAME,\n      ct.TH AS LABTEST_TH,\n      ct.EN AS LABTEST_EN,\n      ct.old_code AS LABTEST_OLD_CODE,\n      l.LABRESULT,\n      l.LABPLACE,\n      h.hosname AS HOSPNAME\n    FROM labfu l\n    LEFT JOIN clabtest_new AS ct\n      ON ct.code = TRIM(l.LABTEST)\n      OR ct.old_code = TRIM(l.LABTEST)\n    LEFT JOIN chospital AS h\n      ON h.hospcode = l.HOSPCODE\n    WHERE l.HOSPCODE = ? AND l.PID = ?\n    ORDER BY l.DATE_SERV DESC \n    LIMIT 20;\n  ";
                    return [4 /*yield*/, db_1.db4.query(sql, [hospcode, pid])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.fetchLabByPid = fetchLabByPid;
function fetchPersonFromHDC(cid) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, rows, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cid)
                        return [2 /*return*/, null];
                    sql = "SELECT CID, NAME, LNAME, HOSPCODE, PID FROM t_person_cid WHERE CID = ? LIMIT 1";
                    return [4 /*yield*/, db_1.db4.query(sql, [cid])];
                case 1:
                    rows = (_a.sent())[0];
                    r = rows;
                    return [2 /*return*/, r.length > 0 ? r[0] : null];
            }
        });
    });
}
exports.fetchPersonFromHDC = fetchPersonFromHDC;
function fetchPersonDetail(cid) {
    return __awaiter(this, void 0, void 0, function () {
        var sqlPerson, p, rowsPerson, rPerson, e_1, rowsCid, rCid, birthRaw, birth, s, d, age, gender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cid)
                        return [2 /*return*/, null];
                    sqlPerson = "\n    SELECT CID, NAME, LNAME, SEX, BIRTH\n    FROM t_person_cid\n    WHERE CID = ?\n    LIMIT 1\n  ";
                    p = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.db4.query(sqlPerson, [cid])];
                case 2:
                    rowsPerson = (_a.sent())[0];
                    rPerson = rowsPerson;
                    p = rPerson[0];
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    // ถ้าตาราง t_person ไม่มี ให้ไป fallback ทันที
                    if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.code) !== "ER_NO_SUCH_TABLE") {
                        throw e_1;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if (!!p) return [3 /*break*/, 6];
                    return [4 /*yield*/, db_1.db4.query("SELECT CID, NAME, LNAME FROM t_person_cid WHERE CID = ? LIMIT 1", [cid])];
                case 5:
                    rowsCid = (_a.sent())[0];
                    rCid = rowsCid;
                    p = rCid[0];
                    if (!p)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            cid: p.CID,
                            firstName: p.NAME,
                            lastName: p.LNAME,
                            gender: "ไม่ทราบ",
                            birthDate: null,
                            age: null
                        }];
                case 6:
                    birthRaw = p.BIRTH;
                    birth = null;
                    if (typeof birthRaw === "string" && /^\d{8}$/.test(birthRaw.trim())) {
                        s = birthRaw.trim();
                        birth = new Date(s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) + "T00:00:00");
                    }
                    else if (birthRaw) {
                        d = new Date(birthRaw);
                        birth = isNaN(d.getTime()) ? null : d;
                    }
                    age = birth
                        ? Math.floor((Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                        : null;
                    gender = "ไม่ทราบ";
                    if (p.SEX === "1" || p.SEX === 1)
                        gender = "ชาย";
                    else if (p.SEX === "2" || p.SEX === 2)
                        gender = "หญิง";
                    return [2 /*return*/, {
                            cid: p.CID,
                            firstName: p.NAME,
                            lastName: p.LNAME,
                            gender: gender,
                            birthDate: p.BIRTH,
                            age: age
                        }];
            }
        });
    });
}
exports.fetchPersonDetail = fetchPersonDetail;
function autoLoginByLineUserId(lineUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var userSql, users, u, user, idNumber, labResults, person, hdcPerson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!lineUserId)
                        return [2 /*return*/, { success: false }];
                    userSql = "SELECT * FROM users WHERE line_user_id = ?";
                    return [4 /*yield*/, db_1.db.query(userSql, [lineUserId])];
                case 1:
                    users = (_a.sent())[0];
                    u = users;
                    if (u.length === 0)
                        return [2 /*return*/, { success: false, message: "User not found" }];
                    user = u[0];
                    idNumber = String(user.id_number || "").trim();
                    return [4 /*yield*/, fetchLabByCid(idNumber)];
                case 2:
                    labResults = _a.sent();
                    return [4 /*yield*/, fetchPersonDetail(idNumber)];
                case 3:
                    person = _a.sent();
                    if (!(labResults.length === 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetchPersonFromHDC(idNumber)];
                case 4:
                    hdcPerson = _a.sent();
                    if (!hdcPerson) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetchLabByPid(hdcPerson.HOSPCODE, hdcPerson.PID)];
                case 5:
                    labResults = _a.sent();
                    // update name in local db (เหมือนเดิม)
                    return [4 /*yield*/, db_1.db.query("UPDATE users SET first_name = ?, last_name = ? WHERE id_number = ?", [hdcPerson.NAME, hdcPerson.LNAME, idNumber])];
                case 6:
                    // update name in local db (เหมือนเดิม)
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, {
                        success: true,
                        user: {
                            idNumber: idNumber,
                            firstName: user.first_name,
                            lastName: user.last_name
                        },
                        person: person,
                        labs: labResults
                    }];
            }
        });
    });
}
exports.autoLoginByLineUserId = autoLoginByLineUserId;
function bindCidToLineLogin(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var idNumber, hdcPerson, firstName, lastName, upsertSql, labResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    idNumber = String(payload.idNumber || "").trim();
                    if (!idNumber)
                        return [2 /*return*/, { success: false }];
                    return [4 /*yield*/, fetchPersonFromHDC(idNumber)];
                case 1:
                    hdcPerson = _a.sent();
                    firstName = hdcPerson ? hdcPerson.NAME : (payload.lineDisplayName || "LINE User");
                    lastName = hdcPerson ? hdcPerson.LNAME : "";
                    upsertSql = "\n    INSERT INTO users (id_number, line_user_id, first_name, last_name, phone, password)\n    VALUES (?, ?, ?, ?, ?, ?)\n    ON DUPLICATE KEY UPDATE \n      line_user_id = VALUES(line_user_id),\n      first_name = VALUES(first_name), \n      last_name = VALUES(last_name)\n  ";
                    return [4 /*yield*/, db_1.db.query(upsertSql, [
                            idNumber,
                            payload.lineUserId || null,
                            firstName,
                            lastName,
                            "-",
                            "LINE_LOGIN",
                        ])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchLabByCid(idNumber)];
                case 3:
                    labResults = _a.sent();
                    if (!(labResults.length === 0 && hdcPerson)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchLabByPid(hdcPerson.HOSPCODE, hdcPerson.PID)];
                case 4:
                    labResults = _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, {
                        success: true,
                        user: { idNumber: idNumber, firstName: firstName, lastName: lastName },
                        labs: labResults
                    }];
            }
        });
    });
}
exports.bindCidToLineLogin = bindCidToLineLogin;
// NOTE: endpoint เดิม Person.js เรียก /cvdrisk/:cid :contentReference[oaicite:5]{index=5}
// ใน server.js ที่คุณอัปโหลด snippet ยังไม่โชว์ส่วนนี้ครบ ผมทำให้เป็น “พร้อมแก้ชื่อ table”
// คุณปรับ SQL ให้ตรงฐานจริงได้ทันที
function fetchCvdRisk(cid) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, rows, r, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cid)
                        return [2 /*return*/, { success: false, results: [] }];
                    sql = "\n    SELECT *\n    FROM cvd_risk\n    WHERE CID = ?\n    ORDER BY REF_DATE DESC\n    LIMIT 1\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.db4.query(sql, [cid])];
                case 2:
                    rows = (_a.sent())[0];
                    r = rows;
                    return [2 /*return*/, { success: true, results: r }];
                case 3:
                    e_2 = _a.sent();
                    // ถ้ายังไม่มี table นี้ จะ error -> ส่งกลับให้ frontend ขึ้น "..."
                    return [2 /*return*/, { success: false, results: [], message: (e_2 === null || e_2 === void 0 ? void 0 : e_2.message) || "cvdrisk query failed" }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchCvdRisk = fetchCvdRisk;
