const { runQuery } = require('../config/db.js');

const getComputers = async () => {
    const sql = `SELECT * FROM computers`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
};

const getComputer = async (id) => {
    const sql = `SELECT * FROM computers WHERE computer_id = $1`;
    const result = await runQuery(sql, [id]);
    if (result.success) {
        return result.data.length > 0 ? result.data[0] : null;
    }
    return result;
};

const createComputer = async (data) => {
    const { brand, model, serial_number, purchase_date, price, is_active = true } = data;
    const sql = `INSERT INTO computers (brand, model, serial_number, purchase_date, price, is_active) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await runQuery(sql, [brand, model, serial_number, purchase_date, price, is_active]);
    return result.success ? result.data[0] : result;
};

const updateComputer = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return { success: false, error: 'No data provided' };
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const sql = `UPDATE computers SET ${setClause} WHERE computer_id = $${keys.length + 1} RETURNING *`;
    const result = await runQuery(sql, [...Object.values(data), id]);
    return result.success ? result.data[0] : result;
};

const deleteComputer = async (id) => {
    const sql = `DELETE FROM computers WHERE computer_id = $1`;
    return await runQuery(sql, [id]);
};

module.exports = { getComputers, getComputer, createComputer, updateComputer, deleteComputer };