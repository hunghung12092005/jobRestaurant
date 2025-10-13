import express from 'express';
import cors from 'cors';
import indexRouter from './routes/indexRouter.js'; // Đảm bảo đường dẫn đúng

const app = express();
const PORT = process.env.LISTEN_PORT || 3000;

// Middleware để parse JSON
app.use(express.json());

// Cấu hình CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Sử dụng router
app.use('/api', indexRouter);

// Bắt đầu máy chủ
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});