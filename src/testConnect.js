const sequelize = require('./config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결에 성공했습니다.');
    const [results] = await sequelize.query('DESCRIBE users');
    console.log('📊 users 테이블 구조:');
    console.table(results);
  } catch (error) {
    console.error('데이터베이스 연결에 실패했습니다:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
