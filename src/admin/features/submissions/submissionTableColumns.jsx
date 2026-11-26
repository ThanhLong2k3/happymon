import { Button, Popconfirm, Select, Space, Tag, Typography } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export function getSubmissionTableColumns({
  previewLoadingId,
  previewSubmissionPaymentProof,
  updateStatus,
  setNoteEditor,
  setNoteDraft,
  deleteSubmission,
  previewWords,
}) {
  return [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      render: (id) => <Text type="secondary">#{id}</Text>,
    },
    {
      title: "Loại",
      dataIndex: "submissionType",
      width: 130,
      render: (type) => (
        <Tag color={type === "enrollment" ? "purple" : "cyan"}>
          {type === "enrollment" ? "Nhập học" : "Thông tin khác"}
        </Tag>
      ),
    },
    {
      title: "Phụ huynh",
      dataIndex: "name",
      width: 220,
      render: (name, record) => (
        <div>
          <strong>{name}</strong>
          {record.parentAddress && (
            <div style={{ fontSize: 12, color: "#8a968e" }}>
              {record.parentAddress}
            </div>
          )}
          {record.email && (
            <a href={`mailto:${record.email}`} style={{ fontSize: 12 }}>
              {record.email}
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      render: (p) => (
        <a href={`tel:${p}`} style={{ color: "#880099", fontWeight: 700 }}>
          <PhoneOutlined /> {p}
        </a>
      ),
    },
    {
      title: "Thông tin bé",
      width: 150,
      render: (_, record) =>
        record.childName ? (
          <div>
            <strong>{record.childName}</strong>
            <div style={{ fontSize: 12, color: "#8a968e" }}>
              {record.childAgeMonths
                ? `${record.childAgeMonths} tháng`
                : record.childAge || ""}
            </div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Ngày nhập học",
      dataIndex: "enrollmentDate",
      width: 130,
      render: (date) =>
        date
          ? new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN")
          : "—",
    },
    {
      title: "Lời nhắn của ba mẹ",
      dataIndex: "message",
      width: 260,
      render: (content) => (
        <span
          title={content || ""}
          style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}
        >
          {previewWords(content)}
        </span>
      ),
    },
    { title: "Ngày gửi", dataIndex: "createdAt", width: 160 },
    {
      title: "Phí giữ chỗ",
      dataIndex: "paymentStatus",
      width: 170,
      render: (status, record) => (
        <Space direction="vertical" size={4}>
          <Tag
            color={
              status === "proof_submitted"
                ? "purple"
                : status === "later"
                  ? "orange"
                  : "default"
            }
          >
            {status === "proof_submitted"
              ? "Chờ xác nhận"
              : status === "later"
                ? "Nộp sau"
                : "Chưa đóng"}
          </Tag>
          {record.hasPaymentProof ? (
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              loading={previewLoadingId === record.id}
              onClick={() => previewSubmissionPaymentProof(record.id)}
            >
              Xem biên nhận
            </Button>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Xử lý trạng thái",
      dataIndex: "status",
      width: 170,
      render: (st, record) => (
        <Select
          value={st}
          style={{ width: "100%" }}
          onChange={(val) => updateStatus(record.id, val)}
          options={[
            { value: "new", label: <Tag color="red">Mới nhận</Tag> },
            { value: "contacted", label: <Tag color="purple">Đã liên hệ</Tag> },
            {
              value: "scheduled",
              label: <Tag color="orange">Đã hẹn làm hồ sơ</Tag>,
            },
            { value: "enrolled", label: <Tag color="green">Đã nhập học</Tag> },
            { value: "cancelled", label: <Tag color="default">Hủy bỏ</Tag> },
          ]}
        />
      ),
    },
    {
      title: "Ghi chú",
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
          {notes ? previewWords(notes, 8) : "Thêm ghi chú"}
        </Button>
      ),
    },
    {
      title: "Thao tác",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Xóa đơn đăng ký này?"
          onConfirm={() => deleteSubmission(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];
}
