import db from "../models/index.js";
const { Contact } = db;

// Tạo liên hệ mới
export const createContactService = async (data) => {
  const contact = await Contact.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });
  return contact;
};

// Lấy tất cả liên hệ (có phân trang)
export const getAllContactsService = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Contact.findAndCountAll({
    order: [['created_at', 'DESC']],
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
