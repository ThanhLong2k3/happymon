import { adminApiRequest } from "../../shared/adminApi.js";

export function getStats(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/stats");
}
