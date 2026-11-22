import { Pagination } from "antd";

export const CARD_PAGE_SIZE = 6;

export function getPageItems(items, page, pageSize = CARD_PAGE_SIZE) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export default function CardPagination({
  current,
  items,
  onChange,
  pageSize = CARD_PAGE_SIZE,
}) {
  if (items.length <= pageSize) return null;

  return (
    <div className="card-pagination">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={items.length}
        showSizeChanger={false}
        onChange={onChange}
      />
    </div>
  );
}
