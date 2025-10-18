// routes/reservationRouter.js
import { Router } from "express";
import { 
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus
} from "../controller/reservationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", createReservation);     
router.get("/getall", authenticateToken, getAllReservations);
router.get("/get/:id", authenticateToken, getReservationById);
router.put("/updatestatus/:id", authenticateToken, updateReservationStatus); // thêm route update status

export default router;
