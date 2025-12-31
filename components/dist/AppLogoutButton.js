"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
function AppLogoutButton(_a) {
    var _b = _a.label, label = _b === void 0 ? "ออกจากระบบ" : _b;
    var router = navigation_1.useRouter();
    var appLogout = function () {
        var ok = confirm("ต้องการออกจากระบบแอปหรือไม่?");
        if (!ok)
            return;
        // 1) เคลียร์เฉพาะข้อมูลแอป (คุณเพิ่ม key อื่นได้)
        try {
            sessionStorage.removeItem("labs");
            sessionStorage.removeItem("cid");
            // ถ้าคุณเคยเก็บอะไรใน localStorage เกี่ยวกับ auth
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("token");
        }
        catch (_a) { }
        // 2) กันกด back แล้วกลับเข้าหน้าเดิม:
        // replace จะไม่เพิ่ม history ใหม่
        router.replace("/");
        // 3) บังคับ refresh state (แน่นอน 100%)
        router.refresh();
    };
    return (React.createElement("button", { onClick: appLogout, style: {
            position: "fixed",
            top: 12,
            right: 12,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 1000
        }, "aria-label": "Logout app", title: "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E2D\u0E1B (\u0E44\u0E21\u0E48\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01 LINE)" }, label));
}
exports["default"] = AppLogoutButton;
