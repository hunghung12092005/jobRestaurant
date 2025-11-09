"use client";

import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Button, Popconfirm, Card, message, Space, ConfigProvider, Tag, App } from "antd";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { GET_USERS, DELETE_USER } from "@/utils/constants";
import dayjs from "dayjs";
import { UserOutlined, PlusCircleOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons';
import userStyles from '../../../styles/user.module.css';
import { useAdminContext } from "../context/AdminContext";

const { Title, Text } = Typography;

interface User {
  id: number | string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminUserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, branch } = useAdminContext();
  // console.log("AdminUserManager - user:", user, "branch:", branch);
  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET_USERS);
      let rawData = res.data?.data?.users || res.data?.users || [];
      if (!Array.isArray(rawData)) rawData = [rawData];

      const processedUsers = rawData.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role === 'admin' ? 'admin' : u.role,
        createdAt: u.createdAt || u.created_at,
      }));

      setUsers(processedUsers);
    } catch (err) {
      console.error(err);
      message.error("Ối! Lỗi khi tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id: number | string) => {
    try {
      setLoading(true);
      await axiosInstance.post(DELETE_USER, { id });
      message.success("Đã xóa người dùng thành công!");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Xóa người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      key: "id",
      width: 80,
      className: userStyles.centerColumn,
      render: (id: number) => <Tag color="blue" style={{ borderRadius: 10, fontWeight: 'bold' }}>#{id}</Tag>
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      render: (username: string) => <Space><UserOutlined style={{ color: '#FF7043' }} /> <Text strong>{username}</Text></Space>
    },
    {
      title: "Email liên hệ",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <Text copyable>{email}</Text>
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        role === 'admin' ? (
          <Tag icon={<CrownOutlined />} className={userStyles.roleTagAdmin}>Quản trị viên</Tag>
        ) : (
          <Tag icon={<UserOutlined />} className={userStyles.roleTagUser}>{role}</Tag>
        )
      ),
      className: userStyles.centerColumn,
    },
    {
      title: "Ngày gia nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
      className: userStyles.centerColumn,
    },
    {
      title: "Hành động",
      key: "action",
      width: 140,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Popconfirm
            title={
              <Text style={{ fontSize: 16 }}>
                Bạn có chắc muốn xóa <Text strong type="danger">{record.username}</Text> không?
              </Text>
            }
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa luôn!"
            cancelText="Hủy"
            placement="topRight"
            disabled={record.role === "admin"} // Popconfirm cũng bị vô hiệu nếu là admin
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.role === "admin"} // Nút sẽ mờ và không bấm được
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },

  ];

  return (
    <App>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#FF7043',
            colorSuccess: '#66BB6A',
            colorWarning: '#FFD54F',
            colorError: '#EF5350',
            colorInfo: '#42A5F5',
            colorTextBase: '#424242',
            fontFamily: 'Nunito, Roboto, "Helvetica Neue", Arial, sans-serif',
            borderRadius: 8,
          },
        }}
      >
        <div className={userStyles.container}>
          <Card className={userStyles.card}>
            <div className={userStyles.header}>
              <Title level={3} className={userStyles.headerTitle}>
                <UserOutlined /> Quản lý Người Dùng Vui Vẻ
              </Title>
              <Button
                type="primary"
                onClick={() => router.push("/auth/register")}
                className={userStyles.addButton}
                icon={<PlusCircleOutlined />}
              >
                Thêm Người Dùng Mới
              </Button>
            </div>

            {loading ? (
              <div className={userStyles.loading}>
                <Spin size="large" />
              </div>
            ) : (
              <Table<User>
                rowKey="id"
                columns={columns}
                dataSource={users}
                pagination={{
                  pageSize: 10,
                  showTotal: (total:any, range:any) => `Hiển thị ${range[0]}-${range[1]} trên ${total} người dùng`
                }}
                bordered
                size="middle"
                className={userStyles.table}
              />
            )}
          </Card>
        </div>
      </ConfigProvider>
    </App>
  );
};

export default AdminUserManager;
