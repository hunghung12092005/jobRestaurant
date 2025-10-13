import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401); // Nếu không có token, trả về 401

  jwt.verify(token, secretKey, (err, decoded) => { // Sử dụng decoded
    if (err) return res.sendStatus(403); // Nếu token không hợp lệ, trả về 403

    // Lấy thông tin từ decoded
    const userId = 1; // Bạn có thể thay đổi logic để lấy userId từ decoded nếu cần
    const tenantId = 1; // Tương tự như trên
    req.decodeToken = { username: decoded.username, userId, tenantId };

    next(); // Tiếp tục đến middleware hoặc route tiếp theo
  });
};