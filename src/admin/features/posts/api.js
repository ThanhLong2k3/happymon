import { adminApiRequest } from "../../shared/adminApi.js";

export function listPosts(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/posts");
}

export function savePost(adminFetch, token, id, values) {
  return adminApiRequest(adminFetch, token, `/api/admin/posts${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: values,
  });
}

export function removePost(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/posts/${id}`, {
    method: "DELETE",
  });
}
