import { Button, Card, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function PostsView({ activeMenu, renderSearch, openModal, filteredPosts, deletePost, adminTableScroll }) {
  return (
    <>
          {/* TAB 5: BÀI VIẾT & TIN TỨC (POSTS) */}
          {activeMenu === "posts" && (
            <Card className="admin-card-table">
              {renderSearch("posts", "Tìm theo tiêu đề, chuyên mục, nội dung...")}
              <Table
                dataSource={filteredPosts}
                rowKey="id"
                scroll={adminTableScroll}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "featuredImage",
                    width: 80,
                    render: (src) => (
                      <img
                        src={src || "/media/placeholder.svg"}
                        alt="Ảnh bài viết"
                        style={{
                          width: 60,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ),
                  },
                  {
                    title: "Tiêu đề",
                    dataIndex: "title",
                    render: (title, record) => (
                      <div>
                        <strong>{title}</strong>
                        <div style={{ fontSize: 11, color: "#8a968e" }}>/{record.slug}</div>
                      </div>
                    ),
                  },
                  { title: "Chuyên mục", dataIndex: "category", render: (cat) => <Tag color="green">{cat}</Tag> },
                  { title: "Ngày đăng", dataIndex: "publishedAt", width: 170 },
                  {
                    title: "Thao tác",
                    fixed: "right",
                    width: 120,
                    render: (_, record) => (
                      <Space>
                        <Button type="text" icon={<EditOutlined style={{ color: "#34664e" }} />} onClick={() => openModal("post", record)} />
                        <Popconfirm title="Xác nhận xóa bài viết?" onConfirm={() => deletePost(record.id)}>
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
