import { Button, Card, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, GiftOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function PromotionsView({
  activeMenu,
  renderSearch,
  filteredPromotions = [],
  openModal,
  deletePromotion,
  adminTableScroll,
}) {
  if (activeMenu !== "promotions") return null;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      render: (id) => <Text type="secondary">#{id}</Text>,
    },
    {
      title: "Tiêu đề chiến dịch",
      dataIndex: "title",
      render: (title) => (
        <div>
          <strong style={{ color: "#4d0057" }}>{title}</strong>
        </div>
      ),
    },
    {
      title: "Thời gian kết thúc (Đếm ngược)",
      dataIndex: "endDate",
      width: 200,
      render: (endDate, record) => {
        const isExpired = endDate ? new Date(endDate).getTime() < Date.now() : false;
        return (
          <div>
            <div style={{ fontWeight: 600 }}>{endDate || "—"}</div>
            {isExpired ? (
              <Tag color="default">Đã hết hạn</Tag>
            ) : (
              <Tag color="processing">Đang chạy</Tag>
            )}
            {record.startDate && (
              <div style={{ fontSize: 11, color: "#8a968e" }}>
                Bắt đầu: {record.startDate}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Các gói ưu đãi",
      render: (_, record) => {
        const tiers = [
          record.tier1,
          record.tier2,
          record.tier3,
          record.tier4,
          record.tier5,
        ].filter(Boolean);

        if (!tiers.length) return <Text type="secondary">Chưa thiết lập ưu đãi</Text>;

        return (
          <Space direction="vertical" size={2}>
            {tiers.map((tier, idx) => (
              <div key={idx} style={{ fontSize: 12 }}>
                <GiftOutlined style={{ color: "#880099", marginRight: 4 }} />
                <span>{tier}</span>
              </div>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Hiển thị",
      dataIndex: "isActive",
      width: 120,
      render: (isActive) =>
        isActive ? (
          <Tag color="success">Đang bật</Tag>
        ) : (
          <Tag color="default">Tạm ẩn</Tag>
        ),
    },
    {
      title: "Thao tác",
      fixed: "right",
      width: 110,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#34664e" }} />}
            onClick={() => openModal("promotion", record)}
          />
          <Popconfirm
            title="Xác nhận xóa chiến dịch ưu đãi này?"
            onConfirm={() => deletePromotion(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="admin-card-table">
      {renderSearch("promotions", "Tìm theo tiêu đề, nội dung ưu đãi...")}
      <Table
        dataSource={filteredPromotions}
        rowKey="id"
        scroll={adminTableScroll}
        pagination={{ pageSize: 8 }}
        columns={columns}
      />
    </Card>
  );
}
