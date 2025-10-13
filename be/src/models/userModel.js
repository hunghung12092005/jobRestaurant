// import bcrypt from "bcrypt";

// const users = []; // Mảng giả lập để lưu trữ người dùng

// // Đăng ký người dùng
// const registerUser = async (username, password) => {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   users.push({ username, password: hashedPassword });
// };
// // Kiểm tra thông tin đăng nhập
// const validateUser = async (username, password) => {
//   const user = users.find((user) => user.username === username);
//   if (user && await bcrypt.compare(password, user.password)) {
//     return user;
//   }
//   return null;
// };

// export default { registerUser, validateUser, users };
'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_token_expired: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false, // vì bạn đã có created_at / updated_at riêng
    underscored: true  // tự động map user.full_name -> full_name trong DB
  });

  return User;
};
