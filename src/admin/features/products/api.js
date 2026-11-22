import { adminApiRequest } from "../../shared/adminApi.js";

export function listProducts(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/products");
}

export function saveProduct(adminFetch, token, id, values) {
  return adminApiRequest(adminFetch, token, `/api/admin/products${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: values,
  });
}

export function removeProduct(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/products/${id}`, {
    method: "DELETE",
  });
}
