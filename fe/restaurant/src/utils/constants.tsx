// Base URL (chung toàn dự án)
// Lấy từ biến môi trường, fallback về localhost khi dev
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export const API_BASE_URL = `${BASE_URL}/api`;

// Các endpoint cụ thể
export const API_LOGIN = `${API_BASE_URL}/auth/login`;
export const API_REGISTER = `${API_BASE_URL}/auth/register`;
export const GET_USER_INFO = `${API_BASE_URL}/auth/me`;
export const GET_USERS = `${API_BASE_URL}/user/getAll`;
export const DELETE_USER = `${API_BASE_URL}/user/delete`;

export const GET_RESERVATIONS = `${API_BASE_URL}/reservation/getAll`;
export const GET_RESERVATION_BY_ID = `${API_BASE_URL}/reservation/get`;
export const UPDATE_RESERVATION_STATUS = `${API_BASE_URL}/reservations/updateStatus`;
export const GET_CONTACTS = `${API_BASE_URL}/contact/getall`;