const { runQuery } = require('../config/db.js');

const getUsers = async () => {
    const sql = `SELECT * FROM users`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
}

const getUser = async (id) => {
    const sql = `SELECT * FROM users WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
}

const updateUser = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return null;
    
    const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
    
    const sql = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const values = [...Object.values(data), id];
    
    const result = await runQuery(sql, values);
    return result.success ? result.data[0] : result;
};

const deleteUser = async (id) => {
    const sql = `DELETE FROM users WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    return result;
}

const createUser = async (data) => {
    const { username, email, password, is_active = true } = data;
    const sql = `INSERT INTO users (username, email, password, is_active) 
               VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await runQuery(sql, [username, email, password, is_active]);
    return result.success ? result.data[0] : result;
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser
}