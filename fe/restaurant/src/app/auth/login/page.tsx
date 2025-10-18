'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';
import axios from 'axios';
import { API_LOGIN } from '../../../utils/constants';
interface LoginFormValues {
    username: string;
    password: string;
}

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);

        try {
            const res = await axios.post(API_LOGIN, {
                usernameOrEmail: values.username,
                password: values.password,
            });

            //  Thành công
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("isLoggedIn", "true");

                message.success(res.data.message || "Đăng nhập thành công!");
                router.push("/admin/user");
            }
            //  Backend trả về lỗi (ví dụ sai mật khẩu)
            else {
                message.warning(res.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác!");
            }
        } catch (err: any) {
            //  Lỗi kết nối hoặc lỗi từ server
            message.error(err.response?.data?.message || "Lỗi kết nối đến máy chủ!");
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
                    <h2 className="form-title">Đăng Nhập</h2>

                    <Form
                        name="login"
                        onFinish={onFinish}
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

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="login-button"
                                block
                            >
                                Đăng Nhập
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