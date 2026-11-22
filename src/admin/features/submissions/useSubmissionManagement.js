import { useEffect, useState } from "react";
import { message } from "antd";
import * as submissionsApi from "./api.js";

export default function useSubmissionManagement({
  adminFetch,
  token,
  setSubmissions,
}) {
  const [noteEditor, setNoteEditor] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [previewLoadingId, setPreviewLoadingId] = useState(null);

  useEffect(
    () => () => {
      if (paymentProofPreview) URL.revokeObjectURL(paymentProofPreview);
    },
    [paymentProofPreview]
  );

  async function updateStatus(id, newStatus) {
    try {
      const response = await submissionsApi.updateStatus(
        adminFetch,
        token,
        id,
        newStatus
      );
      if (!response.ok) throw new Error("Cập nhật thất bại.");
      setSubmissions((previous) =>
        previous.map((submission) =>
          submission.id === id
            ? { ...submission, status: newStatus }
            : submission
        )
      );
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message);
    }
  }

  async function deleteSubmission(id) {
    try {
      const response = await submissionsApi.removeSubmission(
        adminFetch,
        token,
        id
      );
      if (!response.ok) throw new Error("Xóa đơn đăng ký thất bại.");
      setSubmissions((previous) =>
        previous.filter((submission) => submission.id !== id)
      );
      message.success("Đã xóa đơn đăng ký!");
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message);
    }
  }

  async function saveSubmissionNote() {
    if (!noteEditor) return;
    setNoteSaving(true);
    try {
      const response = await submissionsApi.saveNotes(
        adminFetch,
        token,
        noteEditor.id,
        noteDraft
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Lưu ghi chú thất bại.");
      }

      setSubmissions((previous) =>
        previous.map((submission) =>
          submission.id === noteEditor.id
            ? { ...submission, notes: noteDraft }
            : submission
        )
      );
      setNoteEditor(null);
      message.success("Đã lưu ghi chú.");
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message);
    } finally {
      setNoteSaving(false);
    }
  }

  async function previewSubmissionPaymentProof(id) {
    setPreviewLoadingId(id);
    try {
      const response = await submissionsApi.getPaymentProof(
        adminFetch,
        token,
        id
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Không thể tải ảnh biên nhận.");
      }

      setPaymentProofPreview(URL.createObjectURL(await response.blob()));
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message);
    } finally {
      setPreviewLoadingId(null);
    }
  }

  return {
    viewProps: {
      previewLoadingId,
      previewSubmissionPaymentProof,
      updateStatus,
      setNoteEditor,
      setNoteDraft,
      deleteSubmission,
    },
    dialogs: {
      noteEditor,
      noteDraft,
      noteSaving,
      setNoteEditor,
      setNoteDraft,
      saveSubmissionNote,
      paymentProofPreview,
      setPaymentProofPreview,
    },
  };
}
