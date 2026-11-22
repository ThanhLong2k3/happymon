export function adminApiRequest(adminFetch, token, url, { method = "GET", body } = {}) {
  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  if (method !== "GET") {
    options.method = method;
  }
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  return adminFetch(url, options);
}
