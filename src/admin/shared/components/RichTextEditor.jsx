import { useEffect, useRef } from "react";
import { Button, message } from "antd";
import { toRichHtml } from "../../../utils/richContent.js";

export default function RichTextEditor({ value = "", onChange, token, apiFetch }) {
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const lastEmittedHtml = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nextHtml = toRichHtml(value);
    if (nextHtml === lastEmittedHtml.current) {
      lastEmittedHtml.current = null;
      return;
    }
    if (editor.innerHTML !== nextHtml) editor.innerHTML = nextHtml;
  }, [value]);

  function emitChange() {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastEmittedHtml.current = html;
    onChange?.(html);
  }

  function runCommand(command, argument = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    emitChange();
  }

  async function uploadImage(file, savedRange) {
    if (!file?.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      message.error("Ảnh không được vượt quá 5 MB.");
      return;
    }
    try {
      const response = await apiFetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type,
        },
        body: file,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Tải ảnh lên thất bại.");

      const editor = editorRef.current;
      editor?.focus();
      const selection = window.getSelection();
      if (savedRange && editor?.contains(savedRange.commonAncestorContainer)) {
        selection?.removeAllRanges();
        selection?.addRange(savedRange);
      }
      const image = document.createElement("img");
      image.src = result.url;
      image.alt = file.name || "Ảnh nội dung";
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      if (range && editor?.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(image);
        range.setStartAfter(image);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editor?.append(image);
      }
      emitChange();
    } catch (error) {
      if (!error.sessionExpired) message.error(error.message || "Tải ảnh lên thất bại.");
    }
  }

  function handlePaste(event) {
    const imageItems = Array.from(event.clipboardData?.items || []).filter((item) =>
      item.type.startsWith("image/")
    );
    if (!imageItems.length) {
      window.setTimeout(emitChange, 0);
      return;
    }
    event.preventDefault();
    const selection = window.getSelection();
    const savedRange = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    imageItems.forEach((item) => {
      const file = item.getAsFile();
      if (file) uploadImage(file, savedRange);
    });
  }

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Định dạng nội dung">
        <Button size="small" aria-label="In đậm" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("bold")}><strong>B</strong></Button>
        <Button size="small" aria-label="In nghiêng" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("italic")}><em>I</em></Button>
        <Button size="small" aria-label="Gạch chân" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("underline")}><u>U</u></Button>
        <Button size="small" aria-label="Tiêu đề" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "h2")}>H2</Button>
        <Button size="small" aria-label="Danh sách" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertUnorderedList")}>• Danh sách</Button>
        <Button size="small" onMouseDown={(event) => event.preventDefault()} onClick={() => {
          const url = window.prompt("Nhập đường dẫn liên kết");
          if (url) runCommand("createLink", url);
        }}>Liên kết</Button>
        <Button size="small" onMouseDown={(event) => event.preventDefault()} onClick={() => fileRef.current?.click()}>Chèn ảnh</Button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => {
          const file = event.target.files?.[0];
          const selection = window.getSelection();
          uploadImage(file, selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null);
          event.target.value = "";
        }} />
      </div>
      <div
        ref={editorRef}
        className="rich-text-editor__surface"
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        data-placeholder="Nhập nội dung... Có thể định dạng văn bản hoặc dán ảnh trực tiếp."
        onInput={emitChange}
        onPaste={handlePaste}
      />
      <div className="rich-text-editor__hint">Có thể dán ảnh từ clipboard; ảnh sẽ được tải lên và chèn vào nội dung.</div>
    </div>
  );
}
