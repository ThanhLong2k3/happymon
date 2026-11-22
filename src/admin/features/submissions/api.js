import { adminApiRequest } from "../../shared/adminApi.js";

export function listSubmissions(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/submissions");
}

export function updateStatus(adminFetch, token, id, status) {
  return adminApiRequest(adminFetch, token, `/api/admin/submissions/${id}/status`, {
    method: "PUT",
    body: { status },
  });
}

export function saveNotes(adminFetch, token, id, notes) {
  return adminApiRequest(adminFetch, token, `/api/admin/submissions/${id}/status`, {
    method: "PUT",
    body: { notes },
  });
}

export function removeSubmission(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/submissions/${id}`, {
    method: "DELETE",
  });
}

export function getPaymentProof(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/submissions/${id}/payment-proof`);
}
