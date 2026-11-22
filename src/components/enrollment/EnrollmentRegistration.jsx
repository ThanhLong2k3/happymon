import { Col, Row, Typography } from "antd";
import EnrollmentForm from "./EnrollmentForm.jsx";
import EnrollmentHero from "./EnrollmentHero.jsx";
import EnrollmentPaymentModal from "./EnrollmentPaymentModal.jsx";
import useEnrollmentRegistration from "./useEnrollmentRegistration.js";

const { Paragraph, Title } = Typography;

export default function EnrollmentRegistration() {
  const {
    form,
    loading,
    paymentLoading,
    paymentChoice,
    setPaymentChoice,
    paymentFileList,
    setPaymentFileList,
    registration,
    minEnrollmentDate,
    submitRegistration,
    confirmPayment,
    validatePaymentImage,
  } = useEnrollmentRegistration();

  return (
    <section className="site-section enrollment-section" id="registration">
      <div className="site-container">
        <div className="enrollment-heading">
          <span className="eyebrow-tag">Bắt đầu hành trình cùng Happy</span>
          <Title level={2}>Đăng ký nhập học</Title>
          <Paragraph className="centered-copy">
            Ba mẹ điền thông tin đăng ký nhập học cho bé. Bộ phận tuyển sinh sẽ
            liên hệ hướng dẫn hoàn thiện hồ sơ.
          </Paragraph>
        </div>

        <Row gutter={[28, 28]} align="stretch">
          <Col xs={24} lg={14}>
            <EnrollmentForm
              form={form}
              loading={loading}
              minEnrollmentDate={minEnrollmentDate}
              onSubmit={submitRegistration}
            />
          </Col>

          <Col xs={24} lg={10}>
            <EnrollmentHero />
          </Col>
        </Row>
      </div>

      <EnrollmentPaymentModal
        registration={registration}
        paymentChoice={paymentChoice}
        setPaymentChoice={setPaymentChoice}
        paymentFileList={paymentFileList}
        setPaymentFileList={setPaymentFileList}
        paymentLoading={paymentLoading}
        onConfirm={confirmPayment}
        validatePaymentImage={validatePaymentImage}
      />
    </section>
  );
}
