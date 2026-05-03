const ADMIN_ID = "admin123";
const DEFAULT_PASSWORD = "123456";
const AUTH_STATE_KEY = "mm_admin_is_authenticated";
const PASSWORD_KEY = "mm_admin_password";

function getStoredPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

export function authenticateAdmin(adminId, password) {
  return adminId === ADMIN_ID && password === getStoredPassword();
}

export function setAdminSession(isLoggedIn) {
  localStorage.setItem(AUTH_STATE_KEY, String(Boolean(isLoggedIn)));
}

export function isAdminAuthenticated() {
  return localStorage.getItem(AUTH_STATE_KEY) === "true";
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_STATE_KEY);
}

export function setAdminPassword(nextPassword) {
  localStorage.setItem(PASSWORD_KEY, nextPassword);
}
