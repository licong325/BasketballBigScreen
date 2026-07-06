const AUTH_USERS = [
  {
    username: 'demo',
    password: '123456',
    name: '试用账号',
  },
];

const AUTH_SESSION_KEY = 'basketballScoreAuth';
const LOGIN_PAGE = 'login.html';
const HOME_PAGE = 'index.html';

function safeJsonParse(value, fallback = null) {
  try {
    if (value === null || value === undefined || value === '') return fallback;
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function safeStorageJson(key, fallback = null) {
  return safeJsonParse(localStorage.getItem(key), fallback);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function allowPageUnload() {
  window.__allowPageUnload = true;
}

function getCurrentPageName() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1) || HOME_PAGE;
}

function getAuthSession() {
  return safeStorageJson(AUTH_SESSION_KEY, null);
}

function setAuthSession(user) {
  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      username: user.username,
      name: user.name || user.username,
      loginAt: Date.now(),
    })
  );
}

function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function requireLogin() {
  const page = getCurrentPageName();
  if (page === LOGIN_PAGE) return;

  const session = getAuthSession();
  if (!session || !session.username) {
    allowPageUnload();
    window.location.replace(`${LOGIN_PAGE}?redirect=${encodeURIComponent(page)}`);
  }
}

function loginWithAccount(username, password) {
  const user = AUTH_USERS.find(item => item.username === username.trim() && item.password === password);
  if (!user) return false;
  setAuthSession(user);
  return true;
}

function logoutAccount() {
  clearAuthSession();
  allowPageUnload();
  window.location.href = LOGIN_PAGE;
}

requireLogin();
