import { Button, Card, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  eventStatusLabels,
  formatEventDate,
  getEventStatus,
} from "../../../components/events/eventUtils.js";
import { richHtmlToText } from "../../../utils/richContent.js";

const statusColors = {
  upcoming: "blue",
  ongoing: "green",
  completed: "default",
  unknown: "default",
};

export default function EventsView({ activeMenu, renderSearch, filteredEvents, openModal, deleteEvent, adminTableScroll }) {
  if (activeMenu !== "events") return null;

  return (
    <Card className="admin-card-table">
      {renderSearch("events", "Tìm theo tên, địa điểm, mô tả sự kiện...")}
      <Table
        dataSource={filteredEvents}
        rowKey="id"
        scroll={adminTableScroll}
        pagination={{ pageSize: 10 }}
        columns={[
          {
            title: "Ảnh",
            dataIndex: "featuredImage",
            width: 96,
            render: (src, event) => (
              <img
                src={src || "/media/placeholder.svg"}
                alt={event.title}
                style={{
                  display: "block",
                  width: 64,
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ),
          },
          { title: "Tên sự kiện", dataIndex: "title", width: 260, render: (title, event) => <><strong>{title}</strong><div style={{ color: "#8a968e", fontSize: 11 }}>/{event.slug}</div></> },
          { title: "Thời gian", dataIndex: "eventDate", width: 190, render: (date) => formatEventDate(date) },
          { title: "Địa điểm", dataIndex: "location", width: 210, render: (location) => location || "—" },
          { title: "Trạng thái", dataIndex: "eventDate", width: 150, render: (date) => { const status = getEventStatus(date); return <Tag color={statusColors[status]}>{eventStatusLabels[status]}</Tag>; } },
          {
            title: "Mô tả",
            dataIndex: "summary",
            width: 300,
            render: (summary) => {
              const description = richHtmlToText(summary || "");
              return description.length > 50
                ? `${description.slice(0, 50)}...`
                : description || "—";
            },
          },
          {
            title: "Thao tác",
            fixed: "right",
            width: 110,
            render: (_, event) => (
              <Space>
                <Button type="text" aria-label="Sửa sự kiện" icon={<EditOutlined style={{ color: "#880099" }} />} onClick={() => openModal("event", event)} />
                <Popconfirm title="Xóa sự kiện này?" okText="Xóa" cancelText="Hủy" onConfirm={() => deleteEvent(event.id)}>
                  <Button danger type="text" aria-label="Xóa sự kiện" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );
}
