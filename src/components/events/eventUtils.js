export function getEventStatus(eventDate, now = new Date()) {
  if (!eventDate) return "unknown";

  const date = new Date(String(eventDate).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "unknown";

  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (eventDay > today) return "upcoming";
  if (eventDay < today) return "completed";
  return "ongoing";
}

export function formatEventDate(eventDate) {
  if (!eventDate) return "Chưa cập nhật thời gian";
  const date = new Date(String(eventDate).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật thời gian";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export const eventStatusLabels = {
  upcoming: "Sắp diễn ra",
  ongoing: "Đang diễn ra",
  completed: "Đã qua",
  unknown: "Chưa xác định",
};
