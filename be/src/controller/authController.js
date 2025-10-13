import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { registerUser, validateUser } from "../services/authService.js";

dotenv.config();
const secretKey = process.env.SECRET_KEY || "default_secret";

// Đăng ký
export const register = async (req, res) => {
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

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, secretKey, {
      expiresIn: "300h",
    });

    res.status(200).json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
