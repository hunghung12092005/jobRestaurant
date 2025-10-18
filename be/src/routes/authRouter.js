// routes/authRouter.js
import { Router } from "express";
import { login, register, userInfo,getusers,deleteUser } from "../controller/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login",login );
router.post("/register",authenticateToken ,register );
router.get("/me", authenticateToken,userInfo)
router.get("/getusers", authenticateToken,getusers)
router.delete("/deleteuser/:id", authenticateToken, deleteUser)
router.get("/authenticateToken",authenticateToken, (req, res) => {
  const { username, userId } = req.decodeToken;
  res.json({ message: "Authenticated", username, userId });
});

export default router;
