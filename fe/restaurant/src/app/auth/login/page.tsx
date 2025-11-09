'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';
import axios from 'axios';
import { API_LOGIN } from '../../../utils/constants';
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";

interface LoginFormValues {
    username: string;
    password: string;
}

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);

        try {
            const res = await axios.post(API_LOGIN, {
                email: values.username,
                password: values.password,
            });

            //  Thành công
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify(res.data.user));
                // Save redux
                dispatch(
                    loginSuccess({
                        token: res.data.token,
                        user: res.data.user,
                    })
                );
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

                <h1 className="login-title">KANDO & HAMI </h1>
                <p className="login-subtitle">Hochwertiges Restaurantmanagementsystem</p>

                <Card className="login-card">
                    <h2 className="form-title">Einloggen</h2>

                    <Form
                        name="login"
                        onFinish={onFinish}
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

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="login-button"
                                block
                            >
                                Einloggen
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