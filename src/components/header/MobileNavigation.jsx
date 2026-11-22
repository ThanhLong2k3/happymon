import { Link, NavLink } from "react-router-dom";
import { Button, Drawer } from "antd";
import { navigationItems } from "./navigationItems.js";

export default function MobileNavigation({ open, onClose }) {
  return (
    <Drawer
      title="Menu Điều Hướng"
      placement="right"
      onClose={onClose}
      open={open}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onClose}
            style={{ fontSize: 16, fontWeight: 600, padding: "8px 0" }}
          >
            {item.label}
          </NavLink>
        ))}
        <Link to="/lien-he" onClick={onClose}>
          <Button
            type="primary"
            block
            shape="round"
            style={{ marginTop: 12 }}
          >
            Đăng ký nhập học
          </Button>
        </Link>
      </div>
    </Drawer>
  );
}
