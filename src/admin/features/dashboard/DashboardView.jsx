import { Button, Card, Table, Tag } from "antd";
import DashboardStatsRow from "./DashboardStatsRow.jsx";

export default function DashboardView({
  activeMenu,
  stats,
  submissions,
  setActiveMenu,
  dashboardTableScroll,
  previewWords,
}) {
  if (activeMenu !== "dashboard") return null;

  return (
    <>
      <DashboardStatsRow stats={stats} />

      <Card
        className="admin-card-table"
        title={
          <span style={{ fontWeight: 700, color: "#750285" }}>
            Đăng ký tuyển sinh gần nhất
          </span>
        }
        extra={
          <Button type="link" onClick={() => setActiveMenu("submissions")}>
            Xem toàn bộ danh sách →
          </Button>
        }
      >
        <Table
          dataSource={submissions.slice(0, 5)}
          rowKey="id"
          scroll={dashboardTableScroll}
          pagination={false}
          columns={[
            {
              title: "Phụ huynh",
              dataIndex: "name",
              render: (t) => <strong>{t}</strong>,
            },
            {
              title: "Điện thoại",
              dataIndex: "phone",
              render: (p) => (
                <a
                  href={`tel:${p}`}
                  style={{ color: "#880099", fontWeight: 600 }}
                >
                  {p}
                </a>
              ),
            },
            {
              title: "Nội dung quan tâm",
              dataIndex: "message",
              width: 360,
              render: (content) => (
                <span
                  title={content || ""}
                  style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}
                >
                  {previewWords(content)}
                </span>
              ),
            },
            { title: "Thời gian", dataIndex: "createdAt", width: 170 },
            {
              title: "Trạng thái",
              dataIndex: "status",
              width: 130,
              render: (st) => (
                <Tag
                  color={
                    st === "new"
                      ? "red"
                      : st === "contacted"
                        ? "purple"
                        : st === "scheduled"
                          ? "orange"
                          : "green"
                  }
                >
                  {st === "new"
                    ? "Mới nhận"
                    : st === "contacted"
                      ? "Đã liên hệ"
                      : st === "scheduled"
                        ? "Hẹn lịch"
                        : "Đã nhập học"}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
