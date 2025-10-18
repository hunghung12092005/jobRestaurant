import bcrypt from "bcryptjs";
import db from "../models/index.js";

const { User } = db;

// Đăng ký người dùng
export const registerUser = async (username, email, password) => {
  // kiểm tra thiếu dữ liệu
  if (!username || !email || !password) {
    throw new Error("Thiếu thông tin đăng ký (username, email hoặc password)");
  }
  if( password.length < 6 ) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
  }
  if( username.length < 3 ) {
    throw new Error("Tên đăng nhập phải có ít nhất 3 ký tự");
  }
  if( !/\S+@\S+\.\S+/.test(email) ) {
    throw new Error("Email không hợp lệ");
  }

  // kiểm tra trùng username hoặc email
  const existingUser = await User.findOne({
    where: {
      [db.Sequelize.Op.or]: [{ username }, { email }],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }
    if (existingUser.email === email) {
      throw new Error("Email đã được sử dụng");
    }
  }

  // hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = 'admin'; 
  const newUser = await User.create({ username, email, password: hashedPassword,role });
  return newUser;
};

// Xác thực người dùng (login bằng username hoặc email)
export const validateUser = async (usernameOrEmail, password) => {
  if (!usernameOrEmail || !password) return null;

  const user = await User.findOne({
    where: {
      [db.Sequelize.Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });
  
  if(user.status === 'inactive') {
    throw new Error("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
  }
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
};
export const getAllUsers = async () => {
  try {
    const users = await User.findAll(); // Lấy tất cả người dùng
    return users;
  } catch (error) {
    throw new Error("Không thể lấy danh sách người dùng");
  }
};
export const deleteUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  await user.destroy();
  return user;
};