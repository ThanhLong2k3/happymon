import { PhoneOutlined } from "@ant-design/icons";

export default function FloatingCallButton() {
  return (
    <a
      className="floating-call-button"
      href="tel:0985638855"
      aria-label="Gọi cho Happy Montessori theo số 098 563 88 55"
    >
      <span className="floating-call-button__icon" aria-hidden="true">
        <PhoneOutlined />
      </span>
      <span>098 563 88 55</span>
    </a>
  );
}
