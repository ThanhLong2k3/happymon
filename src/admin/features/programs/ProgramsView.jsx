import { Button, Card, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function ProgramsView({ activeMenu, renderSearch, openModal, filteredPrograms, deleteProgram, adminTableScroll }) {
  return (
    <>
          {/* TAB 4: CHƯƠNG TRÌNH & CLB (PROGRAMS) */}
          {activeMenu === "programs" && (
            <Card className="admin-card-table">
              {renderSearch("programs", "Tìm theo tên, phân loại, độ tuổi...")}
              <Table
                dataSource={filteredPrograms}
                rowKey="id"
                scroll={adminTableScroll}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "featuredImage",
                    width: 80,
                    render: (src) => (
                      <img src={src || "/media/placeholder.svg"} alt="" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                    ),
                  },
                  {
                    title: "Tên chương trình",
                    dataIndex: "title",
                    render: (title, record) => (
                      <div>
                        <strong>{title}</strong>
                        <div style={{ fontSize: 11, color: "#8a968e" }}>/{record.slug}</div>
                      </div>
                    ),
                  },
                  {
                    title: "Phân loại",
                    dataIndex: "category",
                    render: (cat) => <Tag color={cat === "montessori" ? "gold" : "cyan"}>{cat}</Tag>,
                  },
                  { title: "Độ tuổi", dataIndex: "ageGroup" },
                  { title: "Thứ tự", dataIndex: "displayOrder", width: 80 },
                  {
                    title: "Thao tác",
                    fixed: "right",
                    width: 120,
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined style={{ color: "#34664e" }} />}
                          onClick={() => openModal("program", record)}
                        />
                        <Popconfirm
                          title="Xác nhận xóa chương trình / CLB này?"
                          onConfirm={() => deleteProgram(record.id)}
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
