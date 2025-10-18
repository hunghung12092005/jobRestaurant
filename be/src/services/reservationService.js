// services/reservationService.js
import db from "../models/index.js";

const { Reservation } = db;

// CREATE
export const createReservationService = async (data) => {
  return await Reservation.create(data);
};

// READ ALL
export const getAllReservationsService = async (page = 1, limit = 10, status) => {
  const offset = (page - 1) * limit;

  const whereCondition = status && status !== "all" ? { status } : {};

  const { count, rows } = await Reservation.findAndCountAll({
    where: whereCondition,
    order: [["date", "DESC"], ["time", "ASC"]],
    limit,
    offset,
  });

  return {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

// READ BY ID
export const getReservationByIdService = async (id) => {
  return await Reservation.findByPk(id);
};
export const updateReservationStatusService = async (id, status) => {
  const reservation = await Reservation.findByPk(id);
  if (!reservation) return null;
  return await reservation.update({ status });
};
