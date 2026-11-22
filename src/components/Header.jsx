import { useState } from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import BrandBar from "./header/BrandBar.jsx";
import DesktopNavigation from "./header/DesktopNavigation.jsx";
import MobileNavigation from "./header/MobileNavigation.jsx";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <BrandBar />
      <header className="site-navbar">
        <div className="site-container navbar-inner">
          <DesktopNavigation />
          <Button
            className="mobile-menu-btn"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </header>
      <MobileNavigation
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
