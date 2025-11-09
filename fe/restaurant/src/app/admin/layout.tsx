"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout, Menu, Button, message, Avatar, Tooltip, Spin, Select, theme } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CrownOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "../../../src/styles/admin-layout.css"; // We will update this CSS extensively
import axiosInstance from "@/utils/axiosInstance";
import { GET_USER_INFO } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import React from "react";
import { AdminContext } from "./context/AdminContext";
const { Header, Sider, Content, Footer } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ username?: string, role?: string }>({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [branch, setBranch] = useState<string | null>(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");
    if (!loggedIn || !token) {
      router.push("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(GET_USER_INFO);
        setUser(response?.data?.user || {});
      } catch (error:any) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        // Nếu token hết hạn / không hợp lệ → xoá localStorage + redirect login
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          message.warning("Phiên đăng nhập hết hạn!");
          localStorage.clear(); // Xóa toàn bộ localStorage
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    message.success("Erfolgreich abgemeldet!");
    router.push("/auth/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: <Link href="/admin/user">Benutzer</Link>,
    },
    {
      key: "reservation",
      icon: <CalendarOutlined />,
      label: <Link href="/admin/reservation">Reservierungen</Link>,
    },
    {
      key: "contact",
      icon: <MailOutlined />,
      label: <Link href="/admin/contact">Kontakt</Link>,
    },
  ];
  // Danh sách chi nhánh
  const branches = [
    { label: "Zweigstelle HA_MI", value: "HA_MI" },
    { label: "Zweigstelle KANDO", value: "KANDO" },
  ];

  // Filter theo quyền
  const filteredBranches = (() => {
    if (!user.role) return [];
    if (user.role === "admin") return branches;
    return branches.filter((b) => b.value === user.role);
  })();

  useEffect(() => {
    if (filteredBranches.length > 0 && !branch) {
      setBranch(filteredBranches[0].value);
    }
  }, [filteredBranches, branch]);

  useEffect(() => {
    console.log("Selected Branch:", branch);
  }, [branch]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark" // Keep dark theme for base, but CSS will override
        width={250}
        collapsedWidth={80}
        trigger={null}
        className="admin-sider" // Add class for custom styling
      >
        {/* Logo Section */}
        <div
          className="sider-brand"
          style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
          }}
        >
          <div className="brand-icon" style={{ display: 'flex', alignItems: 'center' }}>
            {branch === "admin" ? (
              <CrownOutlined style={{ fontSize: 36, color: "#FFD700" }} />
            ) : branch === "HA_MI" ? (
              <img
                src="http://admin.hami-freiberg.de/assets/logo/logo.png"
                alt="Logo Hà Mi"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
            ) : branch === "KANDO" ? (
              <img
                src="https://kando-freiberg.de/assets/logo/logo%20kando2-trang.png"
                alt="Logo KANDO"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
            ) : (
              <HomeOutlined style={{ fontSize: 36, color: "#FFFFFF" }} />
            )}
          </div>

          {!collapsed && (
            <div className="brand-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
                {branch ? branch.replace('_', ' ') : "ADMIN PANEL"}
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#CCC' }}>Restaurant Management</p>
            </div>
          )}
        </div>


        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={["dashboard"]}
          className="admin-menu" // Add class for custom styling
        />

        {/* Sidebar Footer */}
        <div className="sider-footer">
          <Tooltip title={collapsed ? "Abmelden" : ""} placement="right">
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
              className="logout-btn"
            >
              {!collapsed && "Abmelden"}
            </Button>
          </Tooltip>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout className="admin-main-layout" style={{ marginLeft: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header className="admin-header">
          <div className="header-left">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined className="trigger-icon" />
                ) : (
                  <MenuFoldOutlined className="trigger-icon" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            <h1 className="main-header-title">Restaurant Management</h1>

            {filteredBranches.length > 0 && (
              <Select
                value={branch}
                style={{ width: 180, marginLeft: 24 }}
                options={filteredBranches}
                onChange={(value: any) => setBranch(value)}
                placeholder="Chọn chi nhánh"
                className="branch-select"
              />
            )}
          </div>

          <div className="header-right">
            <div className="user-profile">
              <Avatar
                size={42}
                icon={<UserOutlined />}
                className="user-avatar"
              />
              <span className="user-name">{user.username || "Admin"}</span>
            </div>
          </div>
        </Header>

        {/* Content */}
        <Content
          className="admin-content"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <AdminContext.Provider value={{ user, branch, setBranch, loading, setLoading }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <Spin size="large" tip="Đang tải..." />
              </div>
            ) : (
              children
            )}
          </AdminContext.Provider>
        </Content>

        {/* Footer */}
        <Footer className="admin-footer">
          <p>© {new Date().getFullYear()} KANDO & HAMI. Alle Rechte vorbehalten.</p>
        </Footer>
      </Layout>
    </Layout>
  );
}