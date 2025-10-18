"use client";

import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Button, Popconfirm, Card, message, Space, ConfigProvider, Tag } from "antd";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { GET_USERS, DELETE_USER } from "@/utils/constants";
import dayjs from "dayjs";
import { UserOutlined, PlusCircleOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons'; // Thêm icons
import userStyles from '../../../styles/user.module.css'; // Import CSS Modules

const { Title, Text } = Typography;

interface User {
  id: number | string;
  username: string;
  email: string;
  role: string;
  active: boolean; // Giả định có trường này để minh họa tag
  created_at: string;
}

const AdminUserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET_USERS);
      // Giả lập dữ liệu role nếu API không trả về
      const processedUsers = (res.data?.data || res.data || []).map((user: User) => ({
        ...user,
        role: user.role || (user.id === 1 ? 'admin' : 'user'), // Gán role mặc định hoặc dựa vào ID
        active: user.active !== undefined ? user.active : true, // Giả lập active
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

  const handleDelete = async (id: number | string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`${DELETE_USER}/${id}`);
      message.success("Đã xóa người dùng thành công rồi nè!");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Ôi không! Xóa người dùng thất bại rồi.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã số", // Tên cột thân thiện
      dataIndex: "id",
      key: "id",
      width: 80,
      className: userStyles.centerColumn,
      render: (id: number) => <Tag color="blue" style={{ borderRadius: 10, fontWeight: 'bold' }}>#{id}</Tag>
    },
    {
      title: "Tên tài khoản", // Tên cột thân thiện
      dataIndex: "username",
      key: "username",
      render: (username: string) => <Space><UserOutlined style={{ color: '#FF7043' }} /> <Text strong>{username}</Text></Space>
    },
    {
      title: "Email liên hệ", // Tên cột thân thiện
      dataIndex: "email",
      key: "email",
      render: (email: string) => <Text copyable>{email}</Text>
    },
    {
      title: "Vai trò", // Thêm cột vai trò
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        role === 'admin' ? (
          <Tag icon={<CrownOutlined />} className={userStyles.roleTagAdmin}>Quản trị viên</Tag>
        ) : (
          <Tag icon={<UserOutlined />} className={userStyles.roleTagUser}>Người dùng</Tag>
        )
      ),
      className: userStyles.centerColumn,
    },
    {
      title: "Ngày gia nhập", // Tên cột thân thiện
      dataIndex: "created_at",
      key: "created_at",
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
            title={<Text style={{ fontSize: 16 }}>Bạn có chắc muốn xóa <Text strong type="danger">{record.username}</Text> này không?</Text>}
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa luôn!"
            cancelText="Để lại!"
            placement="topRight"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} className={userStyles.deleteButton}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF7043', // Màu cam tươi tắn, năng động (Coral Orange)
          colorSuccess: '#66BB6A', // Xanh lá cây tươi
          colorWarning: '#FFD54F', // Vàng cam ấm áp
          colorError: '#EF5350', // Đỏ san hô
          colorInfo: '#42A5F5', // Xanh dương nhẹ
          colorTextBase: '#424242', // Màu chữ xám đậm, thân thiện
          fontFamily: 'Nunito, Roboto, "Helvetica Neue", Arial, sans-serif', // Font chữ mềm mại, hiện đại
          borderRadius: 8, // Bo tròn mặc định cho các thành phần
        },
        components: {
          Card: {
            headerBg: 'linear-gradient(135deg, #FFFDE7, #FFE0B2)', // Gradient nhẹ nhàng
            extraColor: '#666',
            actionsBg: '#f8f8f8',
            paddingLG: 32,
            padding: 24,
            paddingSM: 16,
            borderRadiusLG: 16, // Bo tròn mạnh hơn cho Card
          },
          Table: {
            headerBg: '#E0F2F7', // Xanh nhạt cho table header
            headerColor: '#424242',
            bodySortBg: '#F1F8E9', // Xanh lá nhạt
            rowHoverBg: '#FFFDE7', // Màu kem nhẹ khi hover
            borderColor: '#E0E0E0',
            rowSelectedBg: '#E8F5E9',
            rowSelectedHoverBg: '#C8E6C9',
            headerSplitColor: 'transparent',
            paddingXS: 8,
            paddingSM: 12,
            padding: 16,
          },
          Button: {
            fontSize: 14,
            fontWeight: 600, // Đậm hơn cho nút
            lineHeight: 1.5714285714285714,
            paddingInline: 18, // Đệm ngang nhiều hơn
            paddingInlineLG: 22,
            paddingBlockLG: 8,
            paddingBlock: 6,
            paddingBlockSM: 2,
            borderRadius: 20, // Bo tròn mạnh cho button
          },
          Popconfirm: {
            // iconColor: '#FF7043',
            // confirmButtonBg: '#FF7043',
            // confirmButtonHoverBg: '#FF8A65',
            // cancelButtonBorderColor: '#E0E0E0',
          },
          Tag: {
            defaultBg: '#CFD8DC',
            defaultColor: '#424242',
            borderRadiusSM: 12, // Bo tròn nhẹ cho tag
          },
          Spin: {
            // colorPrimary: '#FF7043',
          }
        },
      }}
    >
      <div className={userStyles.container}>
        <Card className={userStyles.card}>
          {/* Header */}
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

          {/* Table */}
          {loading ? (
            <div className={userStyles.loading}>
              <Spin size="large" tip={<Text style={{ color: '#FF7043', fontSize: 16 }}>Đang gọi danh sách bạn bè...</Text>} />
            </div>
          ) : (
            <Table<User>
              rowKey="id"
              columns={columns}
              dataSource={users}
              pagination={{ 
                pageSize: 10,
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} người dùng`
              }}
              bordered
              size="middle"
              className={userStyles.table}
              // rowClassName={() => userStyles.tableRow} // Ant Design đã có rowHoverBg, không cần custom rowClassName nếu chỉ để hover
            />
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AdminUserManager;