import { ROLES } from "./roles";

export const navigation = {
    [ROLES.COMPANY_USER]: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Disclosures", path: "/disclosures" },
        { label: "Certificates", path: "/certificates" }
    ],

    [ROLES.AUDITOR]: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Review Disclosures", path: "/review-disclosures" },
        { label: "Audit History", path: "/audit-history" }
    ],

    [ROLES.REGULATOR]: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Disclosures", path: "/disclosures" },
        { label: "Certificates", path: "/certificates" }
    ],

    [ROLES.ADMIN]: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Users", path: "/users" },
        { label: "Companies", path: "/companies" },
        { label: "Audit Logs", path: "/audit-logs" }
    ]
};