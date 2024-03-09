const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_URL
});


module.exports = pool;


const selectDataWithPagination = async (tableName, pageNumber) => {
    const pageSize = 10;
    const offset = (pageNumber - 1) * pageSize;
  
    const query = `SELECT * FROM ${tableName} LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [pageSize, offset]);
  
    return result.rows;
  };

  const selectByEmail = async (tableName, email) => {
    const query = `SELECT * FROM ${tableName} WHERE email = $1`;
    const result = await pool.query(query, [email]);
  
    if (result.rows.length > 0) {
      return result.rows[0][columnName];
    } else {
      return null; 
    }
};

const updateData = async (tableName, id, updateFields) => {
    const setValues = Object.entries(updateFields).map(([key, value], index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(updateFields);
    values.push(id);
  
    const query = `UPDATE ${tableName} SET ${setValues} WHERE id = $${values.length}`;
    await pool.query(query, values);
};

const deleteData = async (tableName, id) => {
    const query = `DELETE FROM ${tableName} WHERE id = $1`;
    await pool.query(query, [id]);
};

const createData = async (tableName, data) => {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    await pool.query(query, values);
};

module.exports = {
  createData,
  deleteData,
  updateData,
  selectByEmail,
  selectDataWithPagination
};