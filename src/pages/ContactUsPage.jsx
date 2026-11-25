import { useState } from "react";
import { Button, Form, Input, Select, Typography, message } from "antd";
import { ArrowRightOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function ContactUsPage() {
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);

  async function submitContact(values) {
    setSending(true);
    const messageText = [
      values.subject ? `Chủ đề: ${values.subject}` : "",
      values.interest ? `Quan tâm đến: ${values.interest}` : "",
      values.message,
    ].filter(Boolean).join("\n\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, message: messageText }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Gửi thông tin chưa thành công.");
      message.success(result.message || "Đã gửi thông tin. Nhà trường sẽ liên hệ với bạn sớm nhất.");
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Không thể gửi thông tin. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="site-section contact-us-section">
      <div className="site-container">
        <div className="contact-us-grid">
          <div className="contact-us-map-panel">
            <iframe
              title="Bản đồ Mầm non Happy Montessori"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5094.5380880791!2d106.05001041196046!3d20.940837280606086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a5627775d83b%3A0xab683536ab776687!2sM%E1%BA%A7m%20non%20Happy%20Montessori!5e1!3m2!1sen!2s!4v1795409104304!5m2!1sen!2s"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="contact-us-details">
              <div><EnvironmentOutlined /> <span>Số 3 Đường Bùi Thị Cúc, Mỹ Hào, Hưng Yên</span></div>
              <a href="tel:0961348219"><PhoneOutlined /> <span>0961 348 219</span></a>
              <a href="mailto:happymon247@gmail.com"><MailOutlined /> <span>happymon247@gmail.com</span></a>
            </div>
          </div>

          <div className="contact-us-form-panel">
            <h2>Ba mẹ cần chúng tôi hỗ trợ gì?</h2>
            <Form form={form} layout="vertical" onFinish={submitContact} requiredMark={false}>
              <Form.Item label="Họ và tên" name="name" rules={[{ required: true, min: 2, max: 100, message: "Vui lòng nhập họ và tên." }]}>
                <Input placeholder="Nguyễn Văn A" autoComplete="name" />
              </Form.Item>
              <div className="contact-us-form-row">
                <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Email chưa đúng định dạng." }]}>
                  <Input placeholder="email@example.com" autoComplete="email" />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, pattern: /^[+0-9()\-\s]{8,20}$/, message: "Vui lòng nhập số điện thoại hợp lệ." }]}>
                  <Input placeholder="0961 348 219" autoComplete="tel" />
                </Form.Item>
              </div>
              <Form.Item label="Chủ đề (không bắt buộc)" name="subject">
                <Input placeholder="Ví dụ: Tư vấn tuyển sinh" />
              </Form.Item>
              <Form.Item label="Ba mẹ quan tâm đến" name="interest">
                <Select options={[
                  { value: "Tuyển sinh", label: "Tuyển sinh" },
                  { value: "Chương trình học", label: "Chương trình học" },
                  { value: "Tham quan trường", label: "Tham quan trường" },
                  { value: "Khác", label: "Khác" },
                ]} />
              </Form.Item>
              <Form.Item label="Lời nhắn" name="message" rules={[{ required: true, min: 10, max: 1800, message: "Vui lòng nhập lời nhắn (ít nhất 10 ký tự)." }]}>
                <TextArea rows={5} placeholder="Ba mẹ chia sẻ điều mình cần tìm hiểu..." />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={sending} block size="large">
                Gửi lời nhắn <ArrowRightOutlined />
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
