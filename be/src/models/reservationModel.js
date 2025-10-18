'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {
            // Nếu sau này muốn liên kết với bảng khác, khai báo ở đây
            // ví dụ: Reservation.belongsTo(models.User)
        }
    }

    Reservation.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            people: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            time: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending', // default value
            },
        },
        {
            sequelize,
            modelName: 'Reservation',
            tableName: 'reservations',
            underscored: true, // created_at, updated_at
            timestamps: true,
        }
    );

    return Reservation;
};
