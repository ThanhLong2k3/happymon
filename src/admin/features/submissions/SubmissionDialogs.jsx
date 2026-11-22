import { Input, Modal } from "antd";

const { TextArea } = Input;

export default function SubmissionDialogs({
  noteEditor,
  noteDraft,
  noteSaving,
  setNoteEditor,
  setNoteDraft,
  saveSubmissionNote,
  paymentProofPreview,
  setPaymentProofPreview,
}) {
  return (
    <>
      <Modal
        title="Ghi chú nội bộ"
        open={Boolean(noteEditor)}
        onCancel={() => setNoteEditor(null)}
        onOk={saveSubmissionNote}
        okText="Lưu ghi chú"
        cancelText="Hủy"
        confirmLoading={noteSaving}
      >
        <TextArea
          rows={5}
          maxLength={2000}
          showCount
          value={noteDraft}
          onChange={(event) => setNoteDraft(event.target.value)}
          placeholder="Ghi chú trao đổi với phụ huynh..."
        />
      </Modal>
      <Modal
        title="Biên nhận phí giữ chỗ"
        open={Boolean(paymentProofPreview)}
        onCancel={() => setPaymentProofPreview(null)}
        footer={null}
        centered
        width={720}
      >
        {paymentProofPreview && (
          <img
            src={paymentProofPreview}
            alt="Ảnh biên nhận phí giữ chỗ"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "75vh",
              objectFit: "contain",
            }}
          />
        )}
      </Modal>
    </>
  );
}
