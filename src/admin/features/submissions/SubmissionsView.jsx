import { Card, Select, Space, Table } from "antd";
import { getSubmissionTableColumns } from "./submissionTableColumns.jsx";

export default function SubmissionsView({
  activeMenu,
  renderSearch,
  submissionTypeFilter,
  setSubmissionTypeFilter,
  submissionStatusFilter,
  setSubmissionStatusFilter,
  filteredSubmissions,
  previewLoadingId,
  previewSubmissionPaymentProof,
  updateStatus,
  setNoteEditor,
  setNoteDraft,
  deleteSubmission,
  adminTableScroll,
  previewWords,
}) {
  if (activeMenu !== "submissions") return null;

  const columns = getSubmissionTableColumns({
    previewLoadingId,
    previewSubmissionPaymentProof,
    updateStatus,
    setNoteEditor,
    setNoteDraft,
    deleteSubmission,
    previewWords,
  });

  return (
    <Card className="admin-card-table">
      <Space wrap>
        {renderSearch("submissions", "Tìm theo tên, số điện thoại, email...")}
        <Select
          value={submissionTypeFilter}
          onChange={setSubmissionTypeFilter}
          style={{ width: 190, marginBottom: 16 }}
          options={[
            { value: "all", label: "Tất cả loại đăng ký" },
            { value: "enrollment", label: "Đăng ký nhập học" },
            { value: "contact", label: "Thông tin khác" },
          ]}
        />
        <Select
          value={submissionStatusFilter}
          onChange={setSubmissionStatusFilter}
          style={{ width: 220, marginBottom: 16 }}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "new", label: "Mới nhận" },
            { value: "contacted", label: "Đã liên hệ" },
            { value: "scheduled", label: "Đã hẹn làm hồ sơ" },
            { value: "enrolled", label: "Đã nhập học" },
            { value: "cancelled", label: "Hủy bỏ" },
          ]}
        />
      </Space>
      <Table
        dataSource={filteredSubmissions}
        rowKey="id"
        scroll={adminTableScroll}
        pagination={{ pageSize: 10 }}
        columns={columns}
      />
    </Card>
  );
}
