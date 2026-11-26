import { adminApiRequest } from "../../shared/adminApi.js";

export function listEvents(adminFetch, token) {
  return adminApiRequest(adminFetch, token, "/api/admin/events");
}

export function saveEvent(adminFetch, token, id, values) {
  const eventDate = values.eventDate
    ? `${values.eventDate.split("T")[0]} ${values.eventDate.split("T")[1]}:00`
    : null;
  return adminApiRequest(adminFetch, token, `/api/admin/events${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: { ...values, eventDate },
  });
}

export function removeEvent(adminFetch, token, id) {
  return adminApiRequest(adminFetch, token, `/api/admin/events/${id}`, {
    method: "DELETE",
  });
}
