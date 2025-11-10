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
import { useAdminContext } from "../context/AdminContext";

const { Title, Text } = Typography;
const { Option } = Select;

interface Reservation {
  id: number;
  name: string;
  phoneNumber: string;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  message?: string;
  status: number;
}

const statusColors: Record<string, string> = {
  0: "#FFC107", // Amber for pending
  1: "#4CAF50", // Green for completed
  2: "#F44336", // Red for canceled
};

const formatStatus = (status: number) => {
  switch (status) {
    case 0: return 'Warten';
    case 1: return 'Abgeschlossen';
    case 2: return 'Storniert';
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
  const [statusFilter, setStatusFilter] = useState<number>(); // Mặc định là 'pending'
  const { user, branch, setBranch } = useAdminContext();
  const fetchReservations = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const body = {
        page: pageNumber,
        size: pageSize,
        status: statusFilter,
        branch: branch,
      };

      const res = await axiosInstance.post(GET_RESERVATIONS, body);
      // console.log("Fetched reservations:", res.data);
      const data = res.data.reservations || res.data.data || res.data;
      setReservations(data);
      setTotal(res.data.total || data.length);
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
  }, [page, pageSize, statusFilter, branch]);

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

  const updateStatus = async (reservationId: number, status: number) => {
    try {
      console.log("Updating reservation status:", reservationId, status);
      setModalLoading(true);
      await axiosInstance.post(`${UPDATE_RESERVATION_STATUS}`, { reservationId, status });
      message.success(`Die Tischreservierung wurde auf den Status geändert: ${formatStatus(status)}`);
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
      title: "Gastname",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: 'left' as const,
      render: (text: string) => <Space><UserOutlined style={{ color: '#1890ff' }} /> {text}</Space>
    },
    {
      title: "Telefonnummer",
      dataIndex: "phoneNumber",
      key: "phone",
      width: 120,
      render: (text: string) => <Text copyable>{text}</Text>
    },
    {
      title: "Anzahl der Personen",
      dataIndex: "partySize",
      key: "partySize",
      width: 80,
      align: 'center' as const,
      sorter: (a: Reservation, b: Reservation) => a.partySize - b.partySize,
      render: (text: number) => <Tag color="geekblue" icon={<TeamOutlined />}>{text}</Tag>
    },
    {
      title: "Datum",
      dataIndex: "reservationDate",
      key: "date",
      width: 120,
      sorter: (a: Reservation, b: Reservation) => dayjs(a.reservationDate).unix() - dayjs(b.reservationDate).unix(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Uhrzeit",
      dataIndex: "reservationTime",
      key: "time",
      width: 100,
      render: (time: string) => <Space><ClockCircleOutlined /> {time}</Space>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) => (
        <Tag color={statusColors[status]} style={{ textTransform: 'capitalize' }}>
          {formatStatus(status)}
        </Tag>
      )
    },
    {
      title: "Zweig",
      dataIndex: "tenant",
      key: "tenant",
      width: 120,
      render: (tenant: string) => (
        <Tag color='red' style={{ textTransform: 'capitalize' }}>
          {tenant}
        </Tag>
      )
    },
    {
      title: "Aktion",
      key: "action",
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: Reservation) => (
        <Button size="small" type="primary" icon={<MoreOutlined />} onClick={() => openReservationModal(record.id)} className={reservationStyles.modalFooterButton}>
          Jetzt ansehen!
        </Button>
      ),
    },
  ], []);

  const dateCellRender = (value: dayjs.Dayjs) => {
    const dayReservations = reservations.filter(r => dayjs(r.reservationDate).isSame(value, 'day'));
    if (!dayReservations.length) return null;

    return (
      <ul className={reservationStyles.calendarEventList}>
        {dayReservations.map((r: any) => (
          <Tooltip key={r.id} title={`${r.name} - ${r.partySize} Personen - ${formatStatus(r.status)}`}>
            <li
              className={reservationStyles.calendarEventItem}
              style={{ backgroundColor: statusColors[r.status] }} // Màu vẫn dùng inline để linh hoạt theo status
              onClick={() => openReservationModal(r.id)}
            >
              <ClockCircleOutlined />
              {r.reservationTime} - {r.name}
            </li>
          </Tooltip>
        ))}
      </ul>
    );
  };

  const tabsItems = [
    {
      key: "table",
      label: <Space><TeamOutlined /> Liste der Tischreservierungen</Space>,
      children: (
        <Table
          dataSource={displayedReservations}
          columns={columns}
          rowKey="id"
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p: any, ps: any) => { setPage(p); setPageSize(ps); },
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total: any, range: any) => `${range[0]}-${range[1]} / ${total} Einträge`,
          }}
          loading={loading}
          scroll={{ x: 900 }}
          bordered
        />
      )
    },
    {
      key: "calendar",
      label: <Space><CalendarOutlined /> Kalenderansicht</Space>,
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
          className={reservationStyles.mainCard}
        >
          <Row justify="space-between" align="middle" className={reservationStyles.headerRow}>
            <Col>
              <Title level={3} className={reservationStyles.pageTitle}>
                <DashboardOutlined /> Tischreservierungsmanagement
              </Title>
            </Col>
            <Col>
              <Space size="middle">
                <Text strong style={{ color: '#555', fontSize: 16 }}>Status anzeigen:</Text>
                <Select
                  value={statusFilter}
                  className={reservationStyles.filterSelect}
                  onChange={(value: any) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <Option value="">Alle</Option>
                  <Option value="0">Warten (Pflege)</Option>
                  <Option value="1">Abgeschlossen (zufrieden)</Option>
                  <Option value="2">Storniert (schade)</Option>
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
              <Text strong>Details zur Tischreservierung #{selectedReservation?.id || '...'}</Text>
              {selectedReservation && (
                <Tag
                  color={statusColors[selectedReservation.status]}
                  className={modalStyles.statusTag}
                >
                  {formatStatus(selectedReservation.status)}
                </Tag>
              )}
            </Space>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={700}
          footer={
            selectedReservation
              ? [
                <Button
                  key="close"
                  onClick={() => setModalVisible(false)}
                  className={modalStyles.modalFooterButton}
                >
                  Schließen
                </Button>,
                selectedReservation.status === 0 && (
                  <Button
                    key="cancel"
                    danger
                    icon={<CloseCircleOutlined />}
                    loading={modalLoading}
                    onClick={() => updateStatus(selectedReservation.id, 2)}
                    className={modalStyles.modalFooterButton}
                  >
                    Stornieren
                  </Button>
                ),
                selectedReservation.status === 0 && (
                  <Button
                    key="complete"
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    loading={modalLoading}
                    onClick={() => updateStatus(selectedReservation.id, 1)}
                    className={`${modalStyles.modalFooterButton} ${modalStyles.modalCompleteButton}`}
                  >
                    Abschließen!
                  </Button>
                ),
              ]
              : null
          }
        >
          {modalLoading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin size="large" tip="Loading...">
                <div style={{ height: 100 }} /> {/* just acts as spinner body */}
              </Spin>
            </div>

          ) : selectedReservation ? (
            <Space
              orientation="vertical" // HA_MI updated
              size="large"
              className={modalStyles.modalContentSpace}
            >
              <Alert
                title={`Aktueller Status: ${formatStatus(selectedReservation.status)}`} // HA_MI updated
                type={
                  selectedReservation.status === 0
                    ? 'warning'
                    : selectedReservation.status === 1
                      ? 'success'
                      : 'error'
                }
                showIcon
                className={modalStyles.alertMessage}
                description={
                  selectedReservation.status === 0
                    ? 'Warten auf die Ankunft, bitte gut vorbereiten!'
                    : selectedReservation.status === 1
                      ? 'Ausgezeichnet! Der Gast hat gegessen und ist sehr zufrieden.'
                      : 'Leider hat der Gast die Reservierung storniert. Bitte kontaktieren Sie ihn später!'
                }
              />
              <Descriptions
                column={2}
                bordered
                size="middle"
                styles={{
                  label: { fontWeight: 'bold', color: '#666', fontSize: 15 },
                  content: { fontSize: 15 },
                }} // HA_MI updated
                className={modalStyles.descriptionsContainer}
              >
                <Descriptions.Item
                  label={<Space><UserOutlined style={{ color: '#FF7043' }} /> Name des Gastes</Space>}
                  span={2}
                >
                  <Text strong>{selectedReservation.name}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Space><PhoneOutlined style={{ color: '#42A5F5' }} /> Telefonnummer</Space>}
                  span={2}
                >
                  <Text copyable>{selectedReservation.phoneNumber}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Space><TeamOutlined style={{ color: '#66BB6A' }} /> Anzahl der Personen</Space>}
                  span={1}
                >
                  <Tag color="geekblue" className={modalStyles.descriptionTag}>
                    {selectedReservation.partySize} Personen
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Space><CalendarOutlined style={{ color: '#FF7043' }} /> Datum der Reservierung</Space>}
                  span={1}
                >
                  {dayjs(selectedReservation.reservationDate).format('DD/MM/YYYY')}
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Space><ClockCircleOutlined style={{ color: '#FFD54F' }} /> Uhr der Ankunft</Space>}
                  span={2}
                >
                  <Tag color="volcano" className={modalStyles.descriptionTag}>
                    {selectedReservation.reservationTime}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<Space><MessageOutlined style={{ color: '#42A5F5' }} /> Nachricht</Space>}
                  span={2}
                >
                  {selectedReservation.message || (
                    <Text type="secondary">
                      Der Gast hat keine Nachricht hinterlassen, Sie können ihn gerne anrufen!
                    </Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          ) : (
            <Text type="secondary">
              Keine Reservierungsinformationen gefunden, der Gast könnte sich verirrt haben!
            </Text>
          )}
        </Modal>

      </div>
    </ConfigProvider>
  );
};

export default ReservationView;