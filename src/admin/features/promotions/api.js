import { adminApiRequest } from "../../shared/adminApi.js";

export function listPromotions(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/promotions");
}

export function savePromotion(adminFetch, token, id, values) {
  return adminApiRequest(
    adminFetch,
    token,
    `/api/admin/promotions${id ? `/${id}` : ""}`,
    {
      method: id ? "PUT" : "POST",
      body: values,
    }
  );
}

export function removePromotion(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/promotions/${id}`, {
    method: "DELETE",
  });
}
