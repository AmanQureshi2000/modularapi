const { runQuery } = require('../config/db.js');

// Get streak for a specific habit
const getStreakByHabit = async (habitId) => {
    let sql = `SELECT * FROM habit_streaks WHERE habit_id = $1`;
    const result = await runQuery(sql, [habitId]);
    return result.success ? result.data[0] : result;
}

// Get all streaks (for dashboard)
const getAllStreaks = async () => {
    let sql = `SELECT hs.*, h.name as habit_name, h.frequency_type 
               FROM habit_streaks hs
               JOIN habits h ON hs.habit_id = h.id
               WHERE h.archived = false
               ORDER BY hs.current_streak DESC`;
    
    const result = await runQuery(sql);
    return result.success ? result.data : result;
}

// Get best performing habits (top streaks)
const getTopStreaks = async (limit = 5) => {
    let sql = `SELECT hs.*, h.name as habit_name 
               FROM habit_streaks hs
               JOIN habits h ON hs.habit_id = h.id
               WHERE h.archived = false
               ORDER BY hs.longest_streak DESC
               LIMIT $1`;
    
    const result = await runQuery(sql, [limit]);
    return result.success ? result.data : result;
}

module.exports = {
    getStreakByHabit,
    getAllStreaks,
    getTopStreaks
};