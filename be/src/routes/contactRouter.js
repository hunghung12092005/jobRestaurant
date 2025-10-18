import { Router } from 'express';
import { createContact, getAllContacts } from '../controller/contactsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Thêm liên hệ
router.post('/create', createContact);

// Lấy tất cả liên hệ (admin mới xem được)
router.get('/getall', authenticateToken, getAllContacts);

export default router;
