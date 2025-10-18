import { createContactService, getAllContactsService } from '../services/contactService.js';

// Tạo liên hệ
export const createContact = async (req, res) => {
  try {
    const contact = await createContactService(req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

// Lấy tất cả liên hệ
export const getAllContacts = async (req, res) => {
  try {
    const {role } = req.decodeToken;
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }   

    // Lấy page và limit từ query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const contacts = await getAllContactsService(page, limit);
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};
