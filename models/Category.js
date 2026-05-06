const { runQuery } = require('../config/db.js');

const getCategories = async () => {
    const sql = `SELECT * FROM categories`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
};

const getCategory = async (id) => {
    const sql = `SELECT * FROM categories WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    if (result.success) {
        return result.data.length > 0 ? result.data[0] : null;
    }
    return result;
};

const createCategory = async (data) => {
    const { user_id, name, color } = data;
    const sql = `INSERT INTO categories (user_id, name, color) 
                 VALUES ($1, $2, $3) RETURNING *`;
    const result = await runQuery(sql, [user_id, name, color]);
    return result.success ? result.data[0] : result;
};

const updateCategory = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return { success: false, error: 'No data provided' };
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const sql = `UPDATE categories SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await runQuery(sql, [...Object.values(data), id]);
    return result.success ? result.data[0] : result;
};

const deleteCategory = async (id) => {
    const sql = `DELETE FROM categories WHERE id = $1`;
    return await runQuery(sql, [id]);
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };