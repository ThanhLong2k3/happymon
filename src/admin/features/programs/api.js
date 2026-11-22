import { adminApiRequest } from "../../shared/adminApi.js";

export function listPrograms(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/programs");
}

export function saveProgram(adminFetch, token, id, values) {
  return adminApiRequest(adminFetch, token, `/api/admin/programs${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: values,
  });
}

export function removeProgram(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/programs/${id}`, {
    method: "DELETE",
  });
}
