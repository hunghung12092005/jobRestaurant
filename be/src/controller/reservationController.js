// controllers/reservationController.js
import { createReservationService, getAllReservationsService, getReservationByIdService, updateReservationStatusService } from "../services/reservationService.js";

export const createReservation = async (req, res) => {
    try {
        const { name, phone, people, date, time, message } = req.body;

        const reservationData = {
            name,
            phone,
            people,
            date,
            time,
            message: message || null, // optional
            // status bỏ đi, sẽ dùng default 'pending' từ model
        };

        const reservation = await createReservationService(reservationData);
        res.status(201).json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create reservation" });
    }
};

// GET all
export const getAllReservations = async (req, res) => {
  try {
    const { role } = req.decodeToken;
    if (role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Lấy page, limit, status từ query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // optional: pending, completed, canceled
    const reservations = await getAllReservationsService(page, limit, status);
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

// GET by ID
export const getReservationById = async (req, res) => {
    try {
        const { role } = req.decodeToken;
        if (role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const reservation = await getReservationByIdService(req.params.id);
        if (!reservation) return res.status(404).json({ error: "Reservation not found" });
        res.json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch reservation" });
    }
};

export const updateReservationStatus = async (req, res) => {
    try {
        const { role } = req.decodeToken;
        if (role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const { id } = req.params;
        const { status } = req.body;

        const updated = await updateReservationStatusService(id, status);
        if (!updated) return res.status(404).json({ error: "Reservation not found" });

        res.json({ message: `Reservation ${status} successfully`, data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update reservation status" });
    }
};