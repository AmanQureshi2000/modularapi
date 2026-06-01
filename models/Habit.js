const { runQuery } = require('../config/db.js');

// Get all active habits (not archived)
const getHabits = async () => {
    let sql = `SELECT * FROM habits WHERE archived = false ORDER BY created_at DESC`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
}

// Get archived habits
const getArchivedHabits = async () => {
    let sql = `SELECT * FROM habits WHERE archived = true ORDER BY archived_at DESC`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
}

// Get a single habit by ID
const getHabit = async (id) => {
    let sql = `SELECT * FROM habits WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
}

// Create a new habit
const createHabit = async (data) => {
    const { name, description, frequency_type, target_days_per_week, target_days_per_month } = data;
    
    let sql = `INSERT INTO habits (name, description, frequency_type, target_days_per_week, target_days_per_month) 
               VALUES ($1, $2, $3, $4, $5) RETURNING *`;
               
    const result = await runQuery(sql, [name, description, frequency_type, target_days_per_week, target_days_per_month]);
    // ID will now be 1, 2, 3... instead of UUID
    return result.success ? result.data[0] : result;
}

// Update a habit
const updateHabit = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return { success: false, error: 'No data provided' };
    
    const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
        
    const sql = `UPDATE habits SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const values = [...Object.values(data), id];
    
    const result = await runQuery(sql, values);
    return result.success ? result.data[0] : result;
}

// Archive a habit (soft delete)
const archiveHabit = async (id) => {
    let sql = `UPDATE habits SET archived = true, archived_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
}

// Restore an archived habit
const restoreHabit = async (id) => {
    let sql = `UPDATE habits SET archived = false, archived_at = NULL WHERE id = $1 RETURNING *`;
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
}

// Permanently delete a habit
const deleteHabit = async (id) => {
    let sql = `DELETE FROM habits WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    return result;
}

module.exports = { 
    getHabits, 
    getArchivedHabits,
    getHabit, 
    createHabit, 
    updateHabit, 
    archiveHabit,
    restoreHabit,
    deleteHabit 
};