export const ROLES = {
    COMPANY_USER: "COMPANY_USER",
    AUDITOR: "AUDITOR",
    REGULATOR: "REGULATOR",
    ADMIN: "ADMIN"
};

export function hasRole(user, role) {
    return user?.role === role;
}

export function hasAnyRole(user, roles) {
    return roles.includes(user?.role);
}
