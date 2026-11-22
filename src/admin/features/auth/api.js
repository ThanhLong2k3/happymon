export function login(credentials) {
  return fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function logout(token) {
  return fetch("/api/admin/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
