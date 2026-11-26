import { adminApiRequest } from "../../shared/adminApi.js";

export function getManagedPage(adminFetch, token, pageKey) {
  return adminApiRequest(adminFetch, token, `/api/admin/pages/${pageKey}`);
}

export function updateManagedPage(adminFetch, token, pageKey, values) {
  return adminApiRequest(adminFetch, token, `/api/admin/pages/${pageKey}`, {
    method: "PUT",
    body: values,
  });
}
