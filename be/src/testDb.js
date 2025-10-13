const db = require('./models'); // vì testDb.js nằm cùng cấp models/

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected!');
    const users = await db.User.findAll();
    console.log('Danh sách user:', users);
  } catch (err) {
    console.error('❌ Lỗi kết nối DB:', err);
  }
})();
