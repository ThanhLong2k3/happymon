import { Link, NavLink } from "react-router-dom";
import { Button } from "antd";
import { navigationItems } from "./navigationItems.js";

export default function DesktopNavigation() {
  return (
    <nav className="nav-menu">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {item.label}
        </NavLink>
      ))}
      <Link to="/lien-he">
        <Button type="primary" shape="round">
          Đăng ký nhập học
        </Button>
      </Link>
    </nav>
  );
}
