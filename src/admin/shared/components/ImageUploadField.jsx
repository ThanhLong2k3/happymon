import { useEffect, useState } from "react";
import { Button, message, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxImageSize = 5 * 1024 * 1024;
const { Text } = Typography;

export default function ImageUploadField({ value, onChange, apiFetch, token }) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setFileList(
      value
        ? [
            {
              uid: value,
              name: value.split("/").pop() || "Ảnh",
              status: "done",
              url: value,
            },
          ]
        : []
    );
  }, [value]);

  function validateImage(file) {
    if (!allowedImageTypes.includes(file.type)) {
      message.error("Chỉ hỗ trợ ảnh JPG, PNG, WebP hoặc GIF.");
      return Upload.LIST_IGNORE;
    }
    if (file.size > maxImageSize) {
      message.error("Ảnh không được vượt quá 5 MB.");
      return Upload.LIST_IGNORE;
    }
    return true;
  }

  async function uploadImage({ file, onSuccess, onError }) {
    setUploading(true);
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
      if (!response.ok) {
        throw new Error(result.error || "Tải ảnh lên thất bại.");
      }
      onChange(result.url);
      onSuccess(result);
      message.success("Đã tải ảnh lên.");
    } catch (error) {
      onError(error);
      if (!error.sessionExpired) {
        message.error(error.message || "Tải ảnh lên thất bại.");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Upload
        accept={allowedImageTypes.join(",")}
        listType="picture"
        fileList={fileList}
        beforeUpload={validateImage}
        customRequest={uploadImage}
        onChange={({ fileList: nextFileList }) =>
          setFileList(nextFileList.slice(-1))
        }
        onRemove={() => {
          onChange(undefined);
          setFileList([]);
          return true;
        }}
        disabled={uploading}
      >
        <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
          Tải ảnh lên
        </Button>
      </Upload>
      <Text type="secondary" style={{ display: "block", marginTop: 6, fontSize: 12 }}>
        JPG, PNG, WebP hoặc GIF; tối đa 5 MB.
      </Text>
    </div>
  );
}
