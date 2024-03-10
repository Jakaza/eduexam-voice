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
      return result.rows[0];
    } else {
      return null; 
    }
};

const selectById = async (tableName, id) => {
  const query = `SELECT * FROM ${tableName} WHERE user_id = $1`;
  const result = await pool.query(query, [id]);

  if (result.rows.length > 0) {
    return result.rows[0];
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

const deleteData = async (tableName, columnName, value) => {
  const query = `DELETE FROM ${tableName} WHERE ${columnName} = $1`;
  await pool.query(query, [value]);
};

const createData = async (tableName, data) => {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    await pool.query(query, values);
};

const selectWithCondition = async (tableName, conditions, pageNumber) => {
  const pageSize = 10;
  const offset = (pageNumber - 1) * pageSize;

  let whereClause = '';
  const values = [];
  if (conditions) {
      const conditionKeys = Object.keys(conditions);
      whereClause = 'WHERE ';
      conditionKeys.forEach((key, index) => {
          whereClause += `${key} = $${index + 1} `;
          values.push(conditions[key]);
          if (index < conditionKeys.length - 1) {
              whereClause += 'AND ';
          }
      });
  }

  const query = `SELECT * FROM ${tableName} ${whereClause} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(pageSize, offset);

  const result = await pool.query(query, values);
  return result.rows;
};




module.exports = {
  createData,
  deleteData,
  updateData,
  selectByEmail,
  selectById,
  selectWithCondition,
  selectDataWithPagination
};