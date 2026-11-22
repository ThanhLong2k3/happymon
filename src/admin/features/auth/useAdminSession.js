import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import * as authApi from "./api.js";

function getStoredToken() {
  const expiresAt = Number(localStorage.getItem("happymon_admin_expires_at")) || 0;
  if (expiresAt && expiresAt <= Date.now()) {
    localStorage.removeItem("happymon_admin_token");
    localStorage.removeItem("happymon_admin_user");
    localStorage.removeItem("happymon_admin_expires_at");
    return "";
  }
  return localStorage.getItem("happymon_admin_token") || "";
}

function getStoredUser() {
  try {
    const expiresAt = Number(localStorage.getItem("happymon_admin_expires_at")) || 0;
    if (expiresAt && expiresAt <= Date.now()) return null;
    return JSON.parse(localStorage.getItem("happymon_admin_user")) || null;
  } catch {
    return null;
  }
}

export default function useAdminSession() {
  const sessionExpiredRef = useRef(false);
  const [token, setToken] = useState(getStoredToken);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(
    () => Number(localStorage.getItem("happymon_admin_expires_at")) || 0
  );
  const [adminUser, setAdminUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const endAdminSession = useCallback((expired = false) => {
    if (sessionExpiredRef.current) return;
    sessionExpiredRef.current = true;
    localStorage.removeItem("happymon_admin_token");
    localStorage.removeItem("happymon_admin_user");
    localStorage.removeItem("happymon_admin_expires_at");
    setToken("");
    setAdminUser(null);
    setSessionExpiresAt(0);
    if (expired) {
      message.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else {
      message.info("Đã đăng xuất.");
    }
  }, []);

  const adminFetch = useCallback(
    async (url, options) => {
      const response = await fetch(url, options);
      if (response.status === 401) {
        endAdminSession(true);
        const error = new Error("Phiên đăng nhập đã hết hạn.");
        error.sessionExpired = true;
        throw error;
      }
      return response;
    },
    [endAdminSession]
  );

  useEffect(() => {
    if (!token || !sessionExpiresAt) return undefined;
    const remaining = sessionExpiresAt - Date.now();
    if (remaining <= 0) {
      endAdminSession(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => endAdminSession(true),
      remaining
    );
    return () => window.clearTimeout(timeoutId);
  }, [token, sessionExpiresAt, endAdminSession]);

  async function login(credentials) {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      let data = {};
      try {
        data = await response.json();
      } catch {
        // A proxy or server outage can return HTML or an empty body instead of JSON.
      }
      if (!response.ok) {
        const fallbackMessage =
          response.status >= 500
            ? "Hệ thống đang tạm thời gặp sự cố. Vui lòng thử lại sau."
            : "Tên đăng nhập hoặc mật khẩu không chính xác.";
        throw new Error(data.error || fallbackMessage);
      }
      if (!data.token || !data.admin) {
        throw new Error("Phản hồi đăng nhập không hợp lệ. Vui lòng thử lại.");
      }

      localStorage.setItem("happymon_admin_token", data.token);
      localStorage.setItem("happymon_admin_user", JSON.stringify(data.admin));
      localStorage.setItem("happymon_admin_expires_at", String(data.expiresAt));
      sessionExpiredRef.current = false;
      setToken(data.token);
      setAdminUser(data.admin);
      setSessionExpiresAt(data.expiresAt);
      message.success("Đăng nhập hệ thống quản trị thành công!");
    } catch (error) {
      message.error(
        error instanceof TypeError
          ? "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại."
          : error.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    authApi.logout(token).catch(() => {});
    endAdminSession(false);
  }

  return { token, adminUser, adminFetch, loading, login, logout };
}
