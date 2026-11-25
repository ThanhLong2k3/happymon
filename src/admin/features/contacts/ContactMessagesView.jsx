import { Button, Card, Popconfirm, Select, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PhoneOutlined } from "@ant-design/icons";

const contactStatuses = [
  { value: "new", label: "M\u1edbi nh\u1eadn", color: "red" },
  { value: "contacted", label: "\u0110\u00e3 li\u00ean h\u1ec7", color: "blue" },
  { value: "scheduled", label: "\u0110\u00e3 h\u1eb9n", color: "orange" },
  { value: "cancelled", label: "\u0110\u00e3 \u0111\u00f3ng", color: "default" },
];

export default function ContactMessagesView({
  activeMenu,
  renderSearch,
  filteredContacts = [],
  updateStatus,
  setNoteEditor,
  setNoteDraft,
  deleteSubmission,
  previewWords,
}) {
  if (activeMenu !== "contacts") return null;

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, render: (id) => `#${id}` },
    {
      title: "Ng\u01b0\u1eddi li\u00ean h\u1ec7",
      dataIndex: "name",
      width: 210,
      render: (name, record) => (
        <div>
          <strong>{name}</strong>
          {record.email && <div><a href={`mailto:${record.email}`}>{record.email}</a></div>}
        </div>
      ),
    },
    {
      title: "\u0110i\u1ec7n tho\u1ea1i",
      dataIndex: "phone",
      width: 150,
      render: (phone) => <a href={`tel:${phone}`}><PhoneOutlined /> {phone}</a>,
    },
    {
      title: "L\u1eddi nh\u1eafn",
      dataIndex: "message",
      width: 300,
      render: (content) => <span title={content || ""}>{previewWords(content, 28)}</span>,
    },
    { title: "Ng\u00e0y g\u1eedi", dataIndex: "createdAt", width: 160 },
    {
      title: "Tr\u1ea1ng th\u00e1i",
      dataIndex: "status",
      width: 150,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: "100%" }}
          onChange={(value) => updateStatus(record.id, value)}
          options={contactStatuses.map(({ value, label, color }) => ({
            value,
            label: <Tag color={color}>{label}</Tag>,
          }))}
        />
      ),
    },
    {
      title: "Ghi ch\u00fa",
      dataIndex: "notes",
      width: 150,
      render: (notes, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setNoteEditor(record);
            setNoteDraft(notes || "");
          }}
        >
          {notes ? previewWords(notes, 8) : "Th\u00eam ghi ch\u00fa"}
        </Button>
      ),
    },
    {
      title: "",
      width: 70,
      fixed: "right",
      render: (_, record) => (
        <Popconfirm
          title="X\u00f3a tin nh\u1eafn n\u00e0y?"
          okText="X\u00f3a"
          cancelText="H\u1ee7y"
          onConfirm={() => deleteSubmission(record.id)}
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card className="admin-card-table">
      <Space wrap style={{ marginBottom: 12 }}>
        {renderSearch("contacts", "T\u00ecm theo t\u00ean, s\u1ed1 \u0111i\u1ec7n tho\u1ea1i, email, l\u1eddi nh\u1eafn...")}
        <Tag color="blue">{filteredContacts.length} tin nh\u1eafn</Tag>
      </Space>
      <Table
        dataSource={filteredContacts}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        columns={columns}
      />
    </Card>
  );
}
