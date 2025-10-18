import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { deleteUserById, getAllUsers, registerUser, validateUser } from "../services/authService.js";

dotenv.config();
const secretKey = process.env.SECRET_KEY || "default_secret";

// Đăng ký
export const register = async (req, res) => {
   const { role } = req.decodeToken;
  if( role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
  }
  const { username, email, password } = req.body;
  try {
    const newUser = await registerUser(username, email, password);
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message || "Đăng ký thất bại" });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await validateUser(usernameOrEmail, password);
    if (!user) {
      return res.status(401).json({ message: "Tên đăng nhập/email hoặc mật khẩu không đúng!" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email ,role: user.role }, secretKey, {
      expiresIn: "300h",
    });

    res.status(200).json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập thất bại", error: error.message });
  }
};

export const userInfo = (req, res) => {
  const { username, userId } = req.decodeToken;
  res.json({ username, userId });
}
export const getusers = async(req, res) => {
  const { username, userId ,role } = req.decodeToken;
  if (!username || !userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if(role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
  }
  const users = await getAllUsers();
  res.json(users);
}
export const deleteUser = async (req, res) => {
  const { username, userId ,role } = req.decodeToken;
  if (!username || !userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if(role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
  }
  const id = req.params.id;
  try {
    const user = await deleteUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};