import { Avatar, Button, Card, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function TestimonialsView({ activeMenu, renderSearch, openModal, filteredTestimonials, deleteTestimonial, adminTableScroll, previewWords }) {
  return (
    <>
          {/* TAB 6: CẢM NHẬN PHỤ HUYNH */}
          {activeMenu === "testimonials" && (
            <Card className="admin-card-table">
              {renderSearch("testimonials", "Tìm theo tên phụ huynh, học sinh, nội dung...")}
              <Table
                dataSource={filteredTestimonials}
                rowKey="id"
                scroll={adminTableScroll}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "avatarUrl",
                    width: 70,
                    render: (src) => (
                      <Avatar
                        size={44}
                        src={src || "/media/placeholder.svg"}
                      />
                    ),
                  },
                  { title: "Phụ huynh", dataIndex: "parentName", render: (name) => <strong>{name}</strong> },
                  { title: "Học sinh", dataIndex: "childName", render: (c) => c || "—" },
                  { title: "Đánh giá", dataIndex: "rating", render: (r) => <Tag color="gold">★★★★★ ({r} sao)</Tag> },
                  {
                    title: "Nội dung trích dẫn",
                    dataIndex: "content",
                    width: 420,
                    render: (content) => (
                      <span
                        title={content || ""}
                        style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}
                      >
                        {previewWords(content)}
                      </span>
                    ),
                  },
                  {
                    title: "Thao tác",
                    fixed: "right",
                    width: 120,
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined style={{ color: "#34664e" }} />}
                          onClick={() => openModal("testimonial", record)}
                        />
                        <Popconfirm
                          title="Xác nhận xóa cảm nhận này?"
                          onConfirm={() => deleteTestimonial(record.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <Button danger type="text" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          )}
    </>
  );
}
