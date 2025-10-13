// routes/authRouter.js
import { Router } from "express";
import { login, register } from "../controller/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login",login );
router.post("/register",register );

router.get("/authenticateToken",authenticateToken, (req, res) => {
  const { username, userId } = req.decodeToken;
  res.json({ message: "Authenticated", username, userId });
});

export default router;
