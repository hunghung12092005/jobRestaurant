"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Calendar,
  Card,
  Typography,
  Modal,
  Spin,
  Button,
  message,
  Tabs,
  Select,
  Space,
  Tag,
  Descriptions,
  Row,
  Col,
  Alert,
  Tooltip,
  ConfigProvider,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  SmileOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from "@/utils/axiosInstance";
import { GET_RESERVATIONS, GET_RESERVATION_BY_ID, UPDATE_RESERVATION_STATUS } from "@/utils/constants";

// Import CSS Modules
import reservationStyles from "../../../styles/reservation.module.css";
import modalStyles from "../../../styles/modal.module.css";

const { Title, Text } = Typography;
const { Option } = Select;

interface Reservation {
  id: number;
  name: string;
  phone: string;
  people: number;
  date: string;
  time: string;
  message?: string;
  status: string;
}

const statusColors: Record<string, string> = {
  pending: "#FFC107", // Amber for pending
  completed: "#4CAF50", // Green for completed
  canceled: "#F44336", // Red for canceled
};

const formatStatus = (status: string) => {
  switch (status) {
    case 'pending': return 'Đang chờ';
    case 'completed': return 'Hoàn thành';
    case 'canceled': return 'Đã hủy';
    default: return status;
  }
};

const ReservationView: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("pending"); // Mặc định là 'pending'

  const fetchReservations = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const query = `?page=${pageNumber}&limit=${pageSize}&status=${statusFilter}`;
      const res = await axiosInstance.get(`${GET_RESERVATIONS}${query}`);
      const data = res.data.data || res.data;
      setReservations(data);
      setTotal(res.data.total || res.data.count || data.length);
      setPage(res.data.page || pageNumber);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(page);
  }, [page, pageSize, statusFilter]);

  const openReservationModal = async (id: number) => {
    try {
      setModalLoading(true);
      const res = await axiosInstance.get(`${GET_RESERVATION_BY_ID}/${id}`);
      setSelectedReservation(res.data);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch reservation detail");
    } finally {
      setModalLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      setModalLoading(true);
      await axiosInstance.put(`${UPDATE_RESERVATION_STATUS}/${id}`, { status });
      message.success(`Đơn đặt bàn đã được chuyển sang trạng thái: ${formatStatus(status)}`);
      setModalVisible(false);
      fetchReservations(page);
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    } finally {
      setModalLoading(false);
    }
  };

  const displayedReservations = reservations;

  const columns = useMemo(() => [
    {
      title: "Khách iu",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: 'left' as const,
      render: (text: string) => <Space><UserOutlined style={{ color: '#1890ff' }} /> {text}</Space>
    },
    {
      title: "Gọi cho",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (text: string) => <Text copyable>{text}</Text>
    },
    {
      title: "Số bạn",
      dataIndex: "people",
      key: "people",
      width: 80,
      align: 'center' as const,
      sorter: (a: Reservation, b: Reservation) => a.people - b.people,
      render: (text: number) => <Tag color="geekblue" icon={<TeamOutlined />}>{text}</Tag>
    },
    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
      width: 120,
      sorter: (a: Reservation, b: Reservation) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Giờ đón",
      dataIndex: "time",
      key: "time",
      width: 100,
      render: (time: string) => <Space><ClockCircleOutlined /> {time}</Space>
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={statusColors[status]} style={{ textTransform: 'capitalize' }}>
          {formatStatus(status)}
        </Tag>
      )
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: Reservation) => (
        <Button size="small" type="primary" icon={<MoreOutlined />} onClick={() => openReservationModal(record.id)} className={reservationStyles.modalFooterButton}>
          Xem ngay!
        </Button>
      ),
    },
  ], []);

  const dateCellRender = (value: dayjs.Dayjs) => {
    const dayReservations = reservations.filter(r => dayjs(r.date).isSame(value, 'day'));
    if (!dayReservations.length) return null;

    return (
      <ul className={reservationStyles.calendarEventList}>
        {dayReservations.map(r => (
          <Tooltip key={r.id} title={`${r.name} - ${r.people} người - ${formatStatus(r.status)}`}>
            <li
              className={reservationStyles.calendarEventItem}
              style={{ backgroundColor: statusColors[r.status] }} // Màu vẫn dùng inline để linh hoạt theo status
              onClick={() => openReservationModal(r.id)}
            >
              <ClockCircleOutlined />
              {r.time} - {r.name}
            </li>
          </Tooltip>
        ))}
      </ul>
    );
  };

  const tabsItems = [
    {
      key: "table",
      label: <Space><TeamOutlined /> Danh sách Đặt bàn</Space>,
      children: (
        <Table
          dataSource={displayedReservations}
          columns={columns}
          rowKey="id"
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} đơn`
          }}
          loading={loading}
          scroll={{ x: 900 }}
          bordered
        />
      )
    },
    {
      key: "calendar",
      label: <Space><CalendarOutlined /> Xem theo Lịch</Space>,
      children: <Calendar dateCellRender={dateCellRender} fullscreen={true} />
    },
  ];

  return (
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
        components: {
          Card: {
            headerBg: 'linear-gradient(135deg, #FFFDE7, #FFE0B2)',
            extraColor: '#666',
            actionsBg: '#f8f8f8',
            paddingLG: 32,
            padding: 24,
            paddingSM: 16,
            borderRadiusLG: 16,
          },
          Table: {
            headerBg: '#E0F2F7',
            headerColor: '#424242',
            bodySortBg: '#F1F8E9',
            rowHoverBg: '#FFFDE7',
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
            fontWeight: 600,
            lineHeight: 1.5714285714285714,
            paddingInline: 18,
            paddingInlineLG: 22,
            paddingBlockLG: 8,
            paddingBlock: 6,
            paddingBlockSM: 2,
            borderRadius: 20,
          },
          Modal: {
            titleFontSize: 22,
            headerBg: 'linear-gradient(45deg, #B2EBF2, #E0F7FA)',
            footerBg: '#F0F4F8',
            borderRadiusLG: 20,
            contentBg: '#ffffff',
            paddingMD: 28,
          },
          Tag: {
            defaultBg: '#CFD8DC',
            defaultColor: '#424242',
            borderRadiusSM: 12,
          },
          Tabs: {
            cardBg: '#fff',
            cardGutter: 12,
            horizontalItemPaddingLG: '14px 24px',
            horizontalItemPadding: '12px 20px',
            horizontalItemMargin: '0 0 0 16px',
            titleFontSize: 18,
            itemSelectedColor: '#FF7043',
            itemHoverColor: '#FF8A65',
            inkBarColor: '#FF7043',
          },
          Select: {
            optionSelectedBg: '#E0F2F7',
            borderRadius: 10,
          },
          Descriptions: {
            labelColor: '#666',
          }
        },
      }}
    >
      <div className={reservationStyles.reservationViewContainer}>
        <Card
          bordered={false}
          className={reservationStyles.mainCard}
        >
          <Row justify="space-between" align="middle" className={reservationStyles.headerRow}>
            <Col>
              <Title level={3} className={reservationStyles.pageTitle}>
                <DashboardOutlined /> Quản lý Đặt Bàn Vui Vẻ
              </Title>
            </Col>
            <Col>
              <Space size="middle">
                <Text strong style={{ color: '#555', fontSize: 16 }}>Xem tình trạng:</Text>
                <Select
                  value={statusFilter}
                  className={reservationStyles.filterSelect}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <Option value="pending">Đang chờ (chăm sóc)</Option>
                  <Option value="completed">Hoàn thành (vui vẻ)</Option>
                  <Option value="canceled">Đã hủy (tiếc quá)</Option>
                </Select>
              </Space>
            </Col>
          </Row>

          <Tabs defaultActiveKey="table" items={tabsItems} size="large" className={reservationStyles.tabsContainer} />
        </Card>

        <Modal
          title={
            <Space className={modalStyles.modalTitle}>
              <SmileOutlined />
              <Text strong>Chi tiết Đặt bàn #{selectedReservation?.id || '...'}</Text>
              {selectedReservation &&
                <Tag color={statusColors[selectedReservation.status]} className={modalStyles.statusTag}>
                  {formatStatus(selectedReservation.status)}
                </Tag>
              }
            </Space>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={700}
          footer={
            selectedReservation
              ? [
                <Button key="close" onClick={() => setModalVisible(false)} className={modalStyles.modalFooterButton}>
                  Đóng lại
                </Button>,
                <Button
                  key="cancel"
                  danger
                  icon={<CloseCircleOutlined />}
                  loading={modalLoading}
                  onClick={() => updateStatus(selectedReservation.id, "canceled")}
                  className={modalStyles.modalFooterButton}
                >
                  Hủy đơn này
                </Button>,
                <Button
                  key="complete"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={modalLoading}
                  onClick={() => updateStatus(selectedReservation.id, "completed")}
                  className={`${modalStyles.modalFooterButton} ${modalStyles.modalCompleteButton}`}
                >
                  Hoàn thành!
                </Button>,
              ]
              : null
          }
        >
          {modalLoading ? (
            <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" tip="Đang gọi chi tiết..." /></div>
          ) : selectedReservation ? (
            <Space direction="vertical" size="large" className={modalStyles.modalContentSpace}>
              <Alert
                message={`Tình trạng hiện tại: ${formatStatus(selectedReservation.status)}`}
                type={selectedReservation.status === 'pending' ? 'warning' : selectedReservation.status === 'completed' ? 'success' : 'error'}
                showIcon
                className={modalStyles.alertMessage}
                description={selectedReservation.status === 'pending' ? "Đang chờ khách đến, chuẩn bị chu đáo nhé!" : selectedReservation.status === 'completed' ? "Tuyệt vời! Khách đã dùng bữa và rất hài lòng." : "Tiếc quá, khách đã hủy hẹn. Hãy liên hệ lại sau nhé!"}
              />
              <Descriptions
                column={2}
                bordered
                size="middle"
                labelStyle={{ fontWeight: 'bold', color: '#666', fontSize: 15 }}
                contentStyle={{ fontSize: 15 }}
                className={modalStyles.descriptionsContainer}
              >
                <Descriptions.Item label={<Space><UserOutlined style={{ color: '#FF7043' }} /> Tên Khách</Space>} span={2}><Text strong>{selectedReservation.name}</Text></Descriptions.Item>
                <Descriptions.Item label={<Space><PhoneOutlined style={{ color: '#42A5F5' }} /> Điện thoại</Space>} span={2}><Text copyable>{selectedReservation.phone}</Text></Descriptions.Item>

                <Descriptions.Item label={<Space><TeamOutlined style={{ color: '#66BB6A' }} /> Số bạn</Space>} span={1}><Tag color="geekblue" className={modalStyles.descriptionTag}>{selectedReservation.people} người</Tag></Descriptions.Item>
                <Descriptions.Item label={<Space><CalendarOutlined style={{ color: '#FF7043' }} /> Ngày hẹn</Space>} span={1}>{dayjs(selectedReservation.date).format("DD/MM/YYYY")}</Descriptions.Item>

                <Descriptions.Item label={<Space><ClockCircleOutlined style={{ color: '#FFD54F' }} /> Giờ đón</Space>} span={2}><Tag color="volcano" className={modalStyles.descriptionTag}>{selectedReservation.time}</Tag></Descriptions.Item>

                <Descriptions.Item label={<Space><MessageOutlined style={{ color: '#42A5F5' }} /> Lời nhắn</Space>} span={2}>
                  {selectedReservation.message || <Text type="secondary">Khách không để lại lời nhắn nào, bạn có thể gọi hỏi thêm!</Text>}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          ) : <Text type="secondary">Không tìm thấy thông tin đặt bàn, có thể khách đã đi lạc đâu đó rồi!</Text>}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ReservationView;