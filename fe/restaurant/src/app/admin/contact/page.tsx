// components/ContactView.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Modal, Button, Spin, message, Space, Tag, Divider, Descriptions } from "antd";
import {
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import axiosInstance from "@/utils/axiosInstance";
import { GET_CONTACTS } from "@/utils/constants";
import { useAdminContext } from "../context/AdminContext";

const { Title, Text } = Typography;

interface Contact {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  tenant?: string;
  message?: string;
  // Đổi tên từ created_at sang createdAt để phù hợp với dữ liệu API
  createdAt: string; // "2025-10-16T16:03:25.965Z"
  updatedAt?: string; // Có thể thêm nếu muốn hiển thị
}

const ContactView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { user, branch, setBranch } = useAdminContext();

  // Helper function to format date from ISO 8601 string
  const formatDateTime = (dateString: string | undefined | null) => {
    if (!dateString) {
      return "Không xác định";
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.warn("Invalid Date string detected:", dateString);
        return dateString; // Fallback to original string if invalid
      }

      // Format to Vietnamese locale, showing full date, time, and optionally timezone
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        // timeZoneName: 'short', // Uncomment if you want to show timezone like GMT+7
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const fetchContacts = async (pageNumber = 1, pageLimit = pageSize) => {
    try {
      setLoading(true);
      console.log({
        page: pageNumber,
        limit: pageLimit,
        tenant: branch || '',
      });
      const res = await axiosInstance.post(GET_CONTACTS, {
        page: pageNumber,
        limit: pageLimit,
        tenant: branch || '',
      });
      // Log để kiểm tra cấu trúc dữ liệu trả về từ API
      console.log("Fetched contacts data:", res.data);

      // Đảm bảo truy cập đúng trường 'data' nếu nó nằm trong một đối tượng lồng ghép
      const fetchedData = res.data.data || res.data; // Use res.data.data if nested, else res.data
      setContacts(fetchedData || []);
      setTotal(res.data.total || res.data.count || 0); // Kiểm tra cả 'count' nếu 'total' không tồn tại
      setPage(res.data.page || pageNumber);
      setPageSize(res.data.limit || pageLimit);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      message.error("Không thể tải danh sách liên hệ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page, pageSize);
  }, [page, pageSize, branch]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: 'center' as 'center',
    },
    {
      title: "Tên",
      dataIndex: "name", // Phù hợp với Contact interface
      key: "name",
      render: (text: string) => <Text strong><UserOutlined style={{ marginRight: 6, color: '#1890ff' }} />{text}</Text>,
      sorter: (a: Contact, b: Contact) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <Space>
          <MailOutlined style={{ color: '#eb2f96' }} />
          <Text copyable>{text}</Text>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (text: string) => (
        <Space>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          <Text copyable>{text}</Text>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: "Tin nhắn",
      dataIndex: "message",
      key: "message",
      ellipsis: { showTitle: true },
      render: (text: string) => (
        text ? (
          <Text ellipsis={{ tooltip: text }}>
            {text}
          </Text>
        ) : (
          <Tag color="default">Không có</Tag>
        )
      ),
    },
    {
      title: "Thời gian gửi",
      dataIndex: "createdAt", // Đổi từ created_at sang createdAt
      key: "createdAt",
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#faad14' }} />
          {formatDateTime(text)}
        </Space>
      ),
      sorter: (a: Contact, b: Contact) => {
        // Safe comparison for sorting
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      },
      width: 180,
    },
    {
      title: "Chi nhánh",
      dataIndex: "tenant",
      key: "tenant",
      ellipsis: { showTitle: true },
      render: (text: string) => (
        text ? (
          <Text ellipsis={{ tooltip: text }}>
            {text}
          </Text>
        ) : (
          <Tag color="default">Không có</Tag>
        )
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: 'center' as 'center',
      width: 100,
      render: (_: any, record: Contact) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedContact(record);
            setModalVisible(true);
          }}
          className="view-detail-button"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 114px)' }}>
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)', borderRadius: 8 }}>
        <Title level={3} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', color: '#333' }}>
          <MailOutlined style={{ marginRight: 12, fontSize: 30, color: '#1890ff' }} />
          Quản lý Liên hệ khách hàng
        </Title>
        <Divider style={{ margin: '0 0 24px 0' }} />

        <Table
          dataSource={contacts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: (p: any, size: any) => {
              setPage(p);
              setPageSize(size || pageSize);
            },
            showTotal: (total: any, range: any) => (
              <Space>
                <Tag color="blue">{total}</Tag>
                liên hệ tổng cộng
              </Space>
            ),
            placement: ['bottomCenter'],
          }}
          bordered
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <img src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrS/empty.svg" alt="no data" style={{ height: 80, marginBottom: 16 }} />
                <p style={{ color: '#999', fontSize: 16 }}>Chưa có dữ liệu liên hệ nào.</p>
                <Button type="link" onClick={() => fetchContacts(1)}>Tải lại dữ liệu</Button>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <Text strong style={{ fontSize: 18 }}>Chi tiết Liên hệ #{selectedContact?.id}</Text>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={650}
        centered
      >
        {selectedContact ? (
          <Descriptions
            bordered
            column={1}
            size="middle"
            styles={{
              label: { width: '160px', fontWeight: 'bold' },
            }}
          >
            <Descriptions.Item label={<Space><UserOutlined /> Tên khách hàng</Space>}>
              {selectedContact.name}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
              <Text copyable>{selectedContact.email}</Text>
            </Descriptions.Item>

            <Descriptions.Item label={<Space><PhoneOutlined /> Điện thoại</Space>}>
              <Text copyable>{selectedContact.phoneNumber}</Text>
            </Descriptions.Item>

            <Descriptions.Item label={<Space><MessageOutlined /> Tin nhắn</Space>}>
              {selectedContact.message || <Tag color="default">Không có tin nhắn</Tag>}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><CalendarOutlined /> Chi nhánh</Space>}>
              {selectedContact.tenant || <Tag color="default">Không có chi nhánh</Tag>}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><CalendarOutlined /> Thời gian gửi</Space>}>
              {formatDateTime(selectedContact.createdAt)}
            </Descriptions.Item>
          </Descriptions>

        ) : (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip="Đang tải chi tiết..." />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactView;