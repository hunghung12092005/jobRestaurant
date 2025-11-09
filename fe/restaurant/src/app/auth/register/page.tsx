'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';
import axios from 'axios';
import { API_REGISTER } from '../../../utils/constants';
import axiosInstance from '@/utils/axiosInstance';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    // ít nhất 6 ký tự, chứa ít nhất 1 chữ và 1 số
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };


  const handleRegister = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      message.warning('Mật khẩu và Xác nhận mật khẩu không trùng nhau!');
      return;
    }

    if (!validatePassword(values.password)) {
      message.warning(
        'Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(API_REGISTER, {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      message.success(res.data?.message || 'Đăng ký thành công!');
      router.push('/admin/user'); // chuyển sang trang quản lý người dùng
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className="login-content">
        <div className="login-logo">
          <div className="logo-circle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            {/* Logo Hà Mi */}
            <img
              src="http://admin.hami-freiberg.de/assets/logo/logo.png"
              alt="Logo Hami"
              width={100}
              height={100}
              style={{ objectFit: "contain", borderRadius: "50%", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
            />

            {/* Logo Kondo */}
            <img
              src="https://kando-freiberg.de/assets/logo/logo%20kando2-trang.png"
              alt="Logo Kondo"
              width={80}
              height={80}
              style={{ objectFit: "contain", borderRadius: "50%", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
            />
          </div>
        </div>

        <h1 className="login-title">KANDO - HAMI</h1>
        <p className="login-subtitle">Hochwertiges Restaurantmanagementsystem</p>

        <Card className="login-card">
          <h2 className="form-title">Registrieren</h2>

          <Form
            name="register"
            onFinish={handleRegister}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label="Anmeldename"
              name="username"
              rules={[{ required: true, message: 'Anmeldename!' }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Anmeldename"
                size="large"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="Email"
                size="large"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              label="Passwort"
              name="password"
              rules={[{ required: true, message: 'Bitte Passwort eingeben!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Passwort"
                size="large"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              label="Passwort bestätigen"
              name="confirmPassword"
              rules={[{ required: true, message: 'Bitte Passwort bestätigen!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Passwort bestätigen"
                size="large"
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              name="role"
              label="Zweigstelle"
              rules={[{ required: true, message: "Bitte Zweigstelle auswählen!" }]}
            >
              <Select
                placeholder="Zweigstelle auswählen"
                size="large"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "Chi nhánh Hà Mi", value: "HA_MI" },
                  { label: "Chi nhánh KANDO", value: "KANDO" },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="login-button"
                block
              >
                Registrieren
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <div className="copyright">
          © 2025 KANDO & HAMI. All rights reserved.
        </div>
      </div>
    </div>
  );
}
