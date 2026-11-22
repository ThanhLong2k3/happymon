import { Avatar, Button, Card, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function TeachersView({ activeMenu, renderSearch, filteredTeachers, openModal, deleteTeacher, adminTableScroll }) {
  return (
    <>
          {/* TAB 3: QUẢN LÝ GIÁO VIÊN (TEACHERS) */}
          {activeMenu === "teachers" && (
            <Card className="admin-card-table">
              {renderSearch("teachers", "Tìm theo tên, chức vụ, lớp...")}
              <Table
                dataSource={filteredTeachers}
                rowKey="id"
                scroll={adminTableScroll}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "avatarUrl",
                    width: 70,
                    render: (src) => <Avatar size={44} src={src || "/media/placeholder.svg"} />,
                  },
                  {
                    title: "Họ và tên",
                    dataIndex: "name",
                    render: (name, record) => (
                      <div>
                        <strong>{name}</strong>
                        <div style={{ fontSize: 11, color: "#8a968e" }}>/{record.slug}</div>
                      </div>
                    ),
                  },
                  { title: "Chức vụ", dataIndex: "roleTitle", render: (r) => r || "Giáo viên Montessori" },
                  {
                    title: "Lớp phụ trách",
                    dataIndex: "className",
                    render: (c) => (c ? <Tag color="success">{c}</Tag> : <Text type="secondary">—</Text>),
                  },
                  { title: "Thứ tự", dataIndex: "displayOrder", width: 80 },
                  {
                    title: "Thao tác",
                    fixed: "right",
                    width: 120,
                    render: (_, record) => (
                      <Space>
                        <Button type="text" icon={<EditOutlined style={{ color: "#34664e" }} />} onClick={() => openModal("teacher", record)} />
                        <Popconfirm title="Xác nhận xóa giáo viên này?" onConfirm={() => deleteTeacher(record.id)}>
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
