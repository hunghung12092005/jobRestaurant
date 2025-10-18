 'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
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
        console.log(values);
      const res = await axiosInstance.post(API_REGISTER, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      console.log(res);

      message.success(res.data?.message || 'Đăng ký thành công!');
    //   router.push('/auth/login'); // chuyển sang login
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
          <div className="logo-circle">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5L35 20H45L37 27L40 42L30 35L20 42L23 27L15 20H25L30 5Z" fill="#D4AF37" />
              <circle cx="30" cy="30" r="28" stroke="#D4AF37" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        <h1 className="login-title">La Maison Royale</h1>
        <p className="login-subtitle">Hệ thống quản lý nhà hàng cao cấp</p>

        <Card className="login-card">
          <h2 className="form-title">Đăng Ký</h2>

          <Form
            name="register"
            onFinish={handleRegister}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Nhập tên đăng nhập"
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
                placeholder="Nhập email"
                size="large"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Nhập mật khẩu"
                size="large"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Xác nhận mật khẩu"
                size="large"
                className="custom-input"
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
                Đăng Ký
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <div className="copyright">
          © 2025 La Maison Royale. All rights reserved.
        </div>
      </div>
    </div>
  );
}
