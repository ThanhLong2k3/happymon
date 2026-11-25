import { PhoneOutlined } from "@ant-design/icons";

export default function FloatingCallButton() {
  return (
    <a
      className="floating-call-button"
      href="tel:0961348219"
      aria-label="Gọi cho Happy Montessori theo số 0961 348 219"
    >
      <span className="floating-call-button__icon" aria-hidden="true">
        <PhoneOutlined />
      </span>
      <span>0961 348 219</span>
    </a>
  );
}
