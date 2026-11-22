import {
  Button,
  Card,
  Col,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IMAGE_TYPES } from "./useEnrollmentRegistration.js";

const { Paragraph, Text, Title } = Typography;

export default function EnrollmentPaymentModal({
  registration,
  paymentChoice,
  setPaymentChoice,
  paymentFileList,
  setPaymentFileList,
  paymentLoading,
  onConfirm,
  validatePaymentImage,
}) {
  return (
    <Modal
      open={Boolean(registration)}
      onCancel={() => onConfirm("later")}
      footer={null}
      width={720}
      centered
      closable
      maskClosable={false}
      title={
        <Title level={4} style={{ textAlign: "center", margin: 0 }}>
          Phí ghi danh giữ chỗ
        </Title>
      }
    >
      <Paragraph type="secondary" style={{ textAlign: "center" }}>
        Ba mẹ có thể nộp phí giữ chỗ ngay hoặc chọn nộp sau. Thông tin đăng ký
        đã được lưu; lựa chọn nộp sau không làm mất hồ sơ.
      </Paragraph>
      <Radio.Group
        value={paymentChoice}
        onChange={(event) => setPaymentChoice(event.target.value)}
        className="enrollment-payment-options"
      >
        <Radio value="paid">Tôi đã chuyển khoản phí giữ chỗ</Radio>
        <Radio value="later">Tôi sẽ nộp phí sau</Radio>
      </Radio.Group>

      {paymentChoice === "paid" && registration && (
        <Card className="enrollment-payment-card">
          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} sm={14}>
              <Space direction="vertical" size={8}>
                <Text>
                  Số tài khoản: <strong>0591000310133</strong>
                </Text>
                <Text>
                  Tên tài khoản: <strong>NGUYEN THI HUYEN</strong>
                </Text>
                <Text>
                  Số tiền: <strong>1.000.000đ</strong>
                </Text>
                <Text>
                  Nội dung chuyển khoản:{" "}
                  <strong>
                    GHIDANH_{registration.parentName.toLocaleUpperCase()}_
                    {registration.parentPhone}
                  </strong>
                </Text>
                <Upload
                  accept={IMAGE_TYPES.join(",")}
                  listType="picture"
                  maxCount={1}
                  fileList={paymentFileList}
                  beforeUpload={validatePaymentImage}
                  onChange={({ fileList }) =>
                    setPaymentFileList(fileList.slice(-1))
                  }
                  onRemove={() => {
                    setPaymentFileList([]);
                    return true;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh biên nhận</Button>
                </Upload>
                <Text type="secondary">
                  JPG, PNG, WebP hoặc GIF; tối đa 5 MB. Vui lòng chụp rõ số tiền
                  và mã giao dịch.
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={10} style={{ textAlign: "center" }}>
              <img
                src="/MaQR.jpg"
                alt="Mã QR thanh toán phí giữ chỗ"
                className="enrollment-payment-qr"
              />
              <Text type="secondary">
                Quét mã QR và kiểm tra đúng số tiền trước khi chuyển.
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      <div className="enrollment-payment-actions">
        <Button onClick={() => onConfirm("later")} disabled={paymentLoading}>
          Nộp phí sau
        </Button>
        <Button
          type="primary"
          loading={paymentLoading}
          onClick={() => onConfirm()}
        >
          {paymentChoice === "paid" ? "Gửi biên nhận" : "Hoàn tất đăng ký"}
        </Button>
      </div>
    </Modal>
  );
}
