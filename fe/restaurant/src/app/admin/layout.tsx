"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout, Menu, Button, message, Avatar, Tooltip, Spin } from "antd"; // Import Spin component
import {
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CrownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "../../../src/styles/admin-layout.css";
import axiosInstance from "@/utils/axiosInstance";
import { GET_USER_INFO } from "@/utils/constants";

const { Header, Sider, Content, Footer } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ username?: string }>({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");

    if (!loggedIn || !token) {
      router.push("/auth/login");
      return; // Stop further execution if not logged in
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(GET_USER_INFO);
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        // Optionally handle error, e.g., redirect to login or show error message
      } finally {
        setLoading(false); // Set loading to false after fetching user info
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    message.success("Đăng xuất thành công!");
    router.push("/auth/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: <Link href="/admin/user">Người dùng</Link>,
    },
    {
      key: "reservation",
      icon: <CalendarOutlined />,
      label: <Link href="/admin/reservation">Lịch đặt</Link>,
    },
    {
      key: "contact",
      icon: <MailOutlined />,
      label: <Link href="/admin/contact">Liên hệ</Link>,
    },
    // You might want to add a dashboard link as default selected
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: <Link href="/admin/dashboard">Bảng điều khiển</Link>,
    },
  ];

  if (loading) {
    // Show a full-page spinner while loading
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải giao diện..." />
      </div>
    );
  }

  return (
    <Layout className="admin-layout">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="admin-sider"
        width={280}
        collapsedWidth={80}
        trigger={null}
      >
        {/* Logo Section */}
        <div className="sider-logo">
          <div className="logo-icon">
            <CrownOutlined className="crown-icon" />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <h2>La Maison</h2>
              <p>Royale</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          items={menuItems}
          className="admin-menu"
          defaultSelectedKeys={["dashboard"]} // Set default selected key
        />

        {/* Sidebar Footer */}
        <div className="sider-footer">
          <Tooltip title={collapsed ? "Đăng xuất" : ""} placement="right">
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
              className="logout-btn"
            >
              {!collapsed && "Đăng xuất"}
            </Button>
          </Tooltip>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout className="admin-main">
        {/* Header */}
        <Header className="admin-header">
          <div className="header-left">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined className="menu-icon" />
                ) : (
                  <MenuFoldOutlined className="menu-icon" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            <div className="header-title">
              <h1>Quản Lý Nhà Hàng</h1>
            </div>
          </div>

          <div className="header-right">
            <div className="user-section">
              <Avatar
                size={42}
                icon={<UserOutlined />}
                className="admin-avatar"
              />
              <div className="user-info">
                <span className="user-name">{user.username || "Admin"}</span>
              </div>
            </div>
          </div>
        </Header>

        {/* Content */}
        <Content className="admin-content">
          <div className="content-wrapper">{children}</div>
        </Content>

        {/* Footer */}
        <Footer className="admin-footer">
          <p>© 2025 La Maison Royale. Tất cả quyền được bảo lưu.</p>
        </Footer>
      </Layout>
    </Layout>
  );
}