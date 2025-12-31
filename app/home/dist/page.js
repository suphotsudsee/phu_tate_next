"use client";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var AppLogoutButton_1 = require("@/components/AppLogoutButton");
var formatLabThai = function (row) {
    return (row === null || row === void 0 ? void 0 : row.LABTEST_TH) || (row === null || row === void 0 ? void 0 : row.LABTEST_NAME) || (row === null || row === void 0 ? void 0 : row.LABTEST) || "-";
};
function safeNumber(v) {
    var n = Number(v);
    return Number.isFinite(n) ? n : null;
}
function toDate(raw) {
    if (!raw)
        return null;
    var s = String(raw).trim();
    // YYYYMMDD
    if (/^\d{8}$/.test(s)) {
        var y = s.slice(0, 4);
        var m = s.slice(4, 6);
        var d = s.slice(6, 8);
        var dt_1 = new Date(y + "-" + m + "-" + d + "T00:00:00");
        return isNaN(dt_1.getTime()) ? null : dt_1;
    }
    // ISO / other formats
    var dt = new Date(s);
    return isNaN(dt.getTime()) ? null : dt;
}
// โหมดแสดงวันที่ไทย: short = 19 เม.ย. 2568, long = 19 เมษายน 2568
function formatThaiDate(raw, mode) {
    if (mode === void 0) { mode = "short"; }
    var dt = toDate(raw);
    if (!dt)
        return "-";
    var locale = "th-TH";
    var options = mode === "long"
        ? { year: "numeric", month: "long", day: "numeric" }
        : { year: "numeric", month: "short", day: "numeric" };
    return dt.toLocaleDateString(locale, options);
}
function HomePage() {
    var _this = this;
    var _a = react_1.useState([]), labs = _a[0], setLabs = _a[1];
    var _b = react_1.useState(""), cid = _b[0], setCid = _b[1];
    var _c = react_1.useState(null), person = _c[0], setPerson = _c[1];
    var _d = react_1.useState({}), userFallback = _d[0], setUserFallback = _d[1];
    var _e = react_1.useState(null), cvdRisk = _e[0], setCvdRisk = _e[1];
    react_1.useEffect(function () {
        var rawLabs = sessionStorage.getItem("labs");
        var rawCid = sessionStorage.getItem("cid");
        var rawPerson = sessionStorage.getItem("person");
        var userFirst = sessionStorage.getItem("userFirstName") || "";
        var userLast = sessionStorage.getItem("userLastName") || "";
        setLabs(rawLabs ? JSON.parse(rawLabs) : []);
        setCid(rawCid || "");
        setPerson(rawPerson ? JSON.parse(rawPerson) : null);
        setUserFallback({ firstName: userFirst, lastName: userLast });
    }, []);
    // เรียง "ล่าสุดอยู่บนสุด" เหมือนภาพ
    var labsSorted = react_1.useMemo(function () {
        var copy = __spreadArrays((labs || []));
        copy.sort(function (a, b) {
            var _a, _b, _c, _d;
            var da = (_b = (_a = toDate(a.DATE_SERV)) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0;
            var db = (_d = (_c = toDate(b.DATE_SERV)) === null || _c === void 0 ? void 0 : _c.getTime()) !== null && _d !== void 0 ? _d : 0;
            return db - da; // ล่าสุดก่อน
        });
        return copy;
    }, [labs]);
    var latestRow = labsSorted[0];
    // ค่าล่าสุด "น้ำตาลในเลือด" (ใน backend เดิม filter LABTEST น้ำตาลอยู่แล้ว) :contentReference[oaicite:1]{index=1}
    var latestGlucose = safeNumber(latestRow === null || latestRow === void 0 ? void 0 : latestRow.LABRESULT);
    // ชื่อหน่วยบริการ
    var latestHosp = (latestRow === null || latestRow === void 0 ? void 0 : latestRow.HOSPNAME) || (latestRow === null || latestRow === void 0 ? void 0 : latestRow.LABPLACE) || (latestRow === null || latestRow === void 0 ? void 0 : latestRow.HOSPCODE) ||
        "ไม่ระบุสถานพยาบาล";
    react_1.useEffect(function () {
        if (!cid)
            return;
        // ถ้ายังไม่มี person ลองดึงจาก API
        if (!person) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var r, d, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch("/api/person/" + cid)];
                        case 1:
                            r = _b.sent();
                            return [4 /*yield*/, r.json()];
                        case 2:
                            d = _b.sent();
                            if (d.success && d.person)
                                setPerson(d.person);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })();
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var r, d, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/cvdrisk/" + cid)];
                    case 1:
                        r = _c.sent();
                        return [4 /*yield*/, r.json()];
                    case 2:
                        d = _c.sent();
                        if (d.success && ((_b = d.results) === null || _b === void 0 ? void 0 : _b.length))
                            setCvdRisk(d.results[0]);
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    }, [cid]);
    if (!labsSorted.length) {
        return (React.createElement("main", { className: "page" },
            React.createElement("h1", { className: "title" }, "\u0E1C\u0E25\u0E15\u0E23\u0E27\u0E08 (\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14)"),
            React.createElement("div", { className: "card", style: { textAlign: "center" } }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08")));
    }
    return (React.createElement("main", { className: "page" },
        React.createElement(AppLogoutButton_1["default"], { label: "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E2D\u0E1B" }),
        React.createElement("h1", { className: "title" }, "\u0E1C\u0E25\u0E15\u0E23\u0E27\u0E08 (\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14)"),
        React.createElement("section", { className: "card", style: { marginBottom: 16 } },
            React.createElement("h3", { style: { margin: "0 0 8px" } }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49"),
            React.createElement("div", { className: "grid" },
                React.createElement("div", null,
                    React.createElement("p", { className: "label" }, "\u0E0A\u0E37\u0E48\u0E2D - \u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25"),
                    React.createElement("p", { className: "value" },
                        (person === null || person === void 0 ? void 0 : person.firstName) || userFallback.firstName || "-",
                        " ",
                        (person === null || person === void 0 ? void 0 : person.lastName) || userFallback.lastName || "")),
                React.createElement("div", null,
                    React.createElement("p", { className: "label" }, "\u0E40\u0E1E\u0E28"),
                    React.createElement("p", { className: "chip chip-gender" }, (person === null || person === void 0 ? void 0 : person.gender) || "-")),
                React.createElement("div", null,
                    React.createElement("p", { className: "label" }, "\u0E2D\u0E32\u0E22\u0E38"),
                    React.createElement("p", { className: "chip chip-age" }, (person === null || person === void 0 ? void 0 : person.age) != null ? person.age + " \u0E1B\u0E35" : "-")),
                React.createElement("div", null,
                    React.createElement("p", { className: "label" }, "\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19"),
                    React.createElement("p", { className: "value mono" }, cid || (person === null || person === void 0 ? void 0 : person.cid) || "-")))),
        React.createElement("section", { className: "card" },
            React.createElement("div", { className: "bigNumber" }, (cvdRisk === null || cvdRisk === void 0 ? void 0 : cvdRisk.Thai_ASCVD2_Risk_percent) != null
                ? Number(cvdRisk.Thai_ASCVD2_Risk_percent).toFixed(1)
                : "..."),
            React.createElement("p", { className: "subTitle" }, "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E42\u0E23\u0E04\u0E2B\u0E31\u0E27\u0E43\u0E08\u0E41\u0E25\u0E30\u0E2B\u0E25\u0E2D\u0E14\u0E40\u0E25\u0E37\u0E2D\u0E14 (10 \u0E1B\u0E35)"),
            React.createElement("div", { className: "muted" }, (cvdRisk === null || cvdRisk === void 0 ? void 0 : cvdRisk.Risk_Category_TH) || "-")),
        React.createElement("section", { className: "card" },
            React.createElement("div", { className: "bigNumber" }, latestGlucose != null ? latestGlucose : "..."),
            React.createElement("p", { className: "subTitle" }, "\u0E19\u0E49\u0E33\u0E15\u0E32\u0E25\u0E43\u0E19\u0E40\u0E25\u0E37\u0E2D\u0E14"),
            React.createElement("div", { className: "muted" }, latestHosp)),
        React.createElement("h2", { className: "sectionTitle" },
            "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E1C\u0E25\u0E41\u0E25\u0E47\u0E1A (\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ",
            labsSorted.length,
            " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23)"),
        React.createElement("div", { className: "tableWrap" },
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48"),
                        React.createElement("th", null, "\u0E2A\u0E16\u0E32\u0E19\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25"),
                        React.createElement("th", null, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"),
                        React.createElement("th", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E25\u0E47\u0E1A"),
                        React.createElement("th", null, "\u0E1C\u0E25"))),
                React.createElement("tbody", null, labsSorted.map(function (row, idx) {
                    var _a;
                    return (React.createElement("tr", { key: (row.CID || cid) + "-" + idx },
                        React.createElement("td", null, formatThaiDate(row.DATE_SERV, "short")),
                        React.createElement("td", null, row.HOSPNAME || row.LABPLACE || row.HOSPCODE || "-"),
                        React.createElement("td", null, row.LABTEST || "-"),
                        React.createElement("td", null, formatLabThai(row)),
                        React.createElement("td", null, safeNumber(row.LABRESULT) != null
                            ? Number(row.LABRESULT).toFixed(2)
                            : (_a = row.LABRESULT) !== null && _a !== void 0 ? _a : "-")));
                }))))));
}
exports["default"] = HomePage;
