const { runQuery } = require('../config/db.js');

// Get all completions for a habit
const getCompletionsByHabit = async (habitId, startDate = null, endDate = null) => {
    let sql = `SELECT * FROM habit_completions WHERE habit_id = $1`;
    let params = [habitId];
    
    if (startDate && endDate) {
        sql += ` AND completion_date BETWEEN $2 AND $3 ORDER BY completion_date DESC`;
        params.push(startDate, endDate);
    } else {
        sql += ` ORDER BY completion_date DESC`;
    }
    
    const result = await runQuery(sql, params);
    return result.success ? result.data : result;
}

// Get completions for a specific date range (all habits)
const getCompletionsByDateRange = async (startDate, endDate) => {
    let sql = `SELECT hc.*, h.name as habit_name, h.frequency_type 
               FROM habit_completions hc
               JOIN habits h ON hc.habit_id = h.id
               WHERE hc.completion_date BETWEEN $1 AND $2
               ORDER BY hc.completion_date DESC`;
    
    const result = await runQuery(sql, [startDate, endDate]);
    return result.success ? result.data : result;
}

// Get today's completions
const getTodayCompletions = async () => {
    let sql = `SELECT hc.*, h.name as habit_name 
               FROM habit_completions hc
               JOIN habits h ON hc.habit_id = h.id
               WHERE hc.completion_date = CURRENT_DATE`;
    
    const result = await runQuery(sql);
    return result.success ? result.data : result;
}

// Mark a habit as completed for today
const createCompletion = async (habitId, notes = null) => {
    let sql = `INSERT INTO habit_completions (habit_id, completion_date, notes) 
               VALUES ($1, CURRENT_DATE, $2) 
               ON CONFLICT (habit_id, completion_date) 
               DO NOTHING 
               RETURNING *`;
    
    const result = await runQuery(sql, [habitId, notes]);
    return result.success ? result.data[0] : result;
}

// Mark completion for a specific date (for backdating)
const createCompletionForDate = async (habitId, completionDate, notes = null) => {
    let sql = `INSERT INTO habit_completions (habit_id, completion_date, notes) 
               VALUES ($1, $2, $3) 
               ON CONFLICT (habit_id, completion_date) 
               DO NOTHING 
               RETURNING *`;
    
    const result = await runQuery(sql, [habitId, completionDate, notes]);
    return result.success ? result.data[0] : result;
}

// Remove a completion (unmark habit)
const deleteCompletion = async (id) => {
    let sql = `DELETE FROM habit_completions WHERE id = $1 RETURNING *`;
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
}

// Check if habit was completed on a specific date
const isCompletedOnDate = async (habitId, date) => {
    let sql = `SELECT * FROM habit_completions WHERE habit_id = $1 AND completion_date = $2`;
    const result = await runQuery(sql, [habitId, date]);
    return result.success ? result.data.length > 0 : false;
}

module.exports = {
    getCompletionsByHabit,
    getCompletionsByDateRange,
    getTodayCompletions,
    createCompletion,
    createCompletionForDate,
    deleteCompletion,
    isCompletedOnDate
};