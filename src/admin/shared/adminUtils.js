export const adminTableScroll = {
  x: "max-content",
  y: "max(120px, calc(100vh - var(--admin-table-height-offset, 390px)))",
};

export const dashboardTableScroll = {
  x: "max-content",
  y: "max(120px, calc(100vh - var(--admin-dashboard-table-height-offset, 480px)))",
};

function normalizeSearchValue(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export function searchItems(items, query, fields) {
  const normalizedQuery = normalizeSearchValue(query).trim();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    fields.some((field) =>
      normalizeSearchValue(item[field]).includes(normalizedQuery)
    )
  );
}

export function previewWords(value, limit = 50) {
  const text = String(value ?? "").trim();
  if (!text) return "—";

  const words = text.split(/\s+/);
  return words.length > limit
    ? `${words.slice(0, limit).join(" ")}...`
    : text;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}
