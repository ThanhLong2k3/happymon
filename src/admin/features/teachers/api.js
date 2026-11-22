import { adminApiRequest } from "../../shared/adminApi.js";

export function listTeachers(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/teachers");
}

export function saveTeacher(adminFetch, token, id, values) {
  return adminApiRequest(adminFetch, token, `/api/admin/teachers${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: values,
  });
}

export function removeTeacher(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/teachers/${id}`, {
    method: "DELETE",
  });
}
