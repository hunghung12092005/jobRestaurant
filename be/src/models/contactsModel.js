'use strict';
const { Model } = require('sequelize');
    
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // Nếu muốn liên kết với bảng khác, khai báo ở đây
      // ví dụ: Contact.belongsTo(models.User)
    }
  }

  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Contact',
      tableName: 'contacts',
      underscored: true, // dùng created_at, updated_at
      timestamps: true,
    }
  );

  return Contact;
};
