const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_URL
});

const initDB = async () => {
  try {
    await pool.connect();
    console.log('DB Connected');
  } catch (error) {
    console.error('DB Connection Failed:', error);
  }
};

module.exports = initDB;