import { adminApiRequest } from "../../shared/adminApi.js";

export function listTestimonials(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/testimonials");
}

export function saveTestimonial(adminFetch, token, id, values) {
  return adminApiRequest(adminFetch, token, `/api/admin/testimonials${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: values,
  });
}

export function removeTestimonial(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/testimonials/${id}`, {
    method: "DELETE",
  });
}
