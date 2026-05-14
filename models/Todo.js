const { runQuery } = require('../config/db.js');

const findAll = async (filters = {}) => {
    let query = 'SELECT * FROM todos';
    const params = [];
    const conditions = [];
    let paramIndex = 1;
    
    // Build WHERE conditions based on filters
    if (filters.status && filters.status !== '') {
        conditions.push(`status = $${paramIndex++}`);
        params.push(filters.status);
    }
    
    if (filters.priority && filters.priority !== '') {
        conditions.push(`priority = $${paramIndex++}`);
        params.push(filters.priority);
    }
    
    if (filters.search && filters.search !== '') {
        conditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add ORDER BY
    query += ' ORDER BY created_at DESC';
    
    console.log('Executing query:', query); // Debug log
    console.log('With params:', params); // Debug log
    
    const result = await runQuery(query, params);
    return result.success ? result.data : result;
};

const findTodoById = async (id) => {
    const sql = 'SELECT * FROM todos WHERE id = $1';
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
};

const createTodo = async (todoData) => {
    const { title, description, priority, due_date } = todoData;
    const sql = `INSERT INTO todos (title, description, priority, due_date) 
                 VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await runQuery(sql, [title, description, priority || 'medium', due_date || null]);
    return result.success ? result.data[0] : result;
};

const updateTodo = async (id, updates) => {
    const keys = Object.keys(updates);
    if (keys.length === 0) return null;
    
    const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
    
    let sql = `UPDATE todos SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    let values = [...Object.values(updates), id];
    
    // Handle special case for status='completed'
    if (updates.status === 'completed') {
        sql = `UPDATE todos SET ${setClause}, completed_at = CURRENT_TIMESTAMP 
               WHERE id = $${keys.length + 1} RETURNING *`;
    }
    
    const result = await runQuery(sql, values);
    return result.success ? result.data[0] : result;
};

const deleteTodo = async (id) => {
    const sql = 'DELETE FROM todos WHERE id = $1 RETURNING id';
    const result = await runQuery(sql, [id]);
    return result;
};

const getTodoStats = async () => {
    const sql = `
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
            COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived,
            COUNT(CASE WHEN priority = 'high' AND status != 'completed' THEN 1 END) as high_priority_pending,
            COUNT(CASE WHEN priority = 'urgent' AND status != 'completed' THEN 1 END) as urgent_pending,
            COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'completed' THEN 1 END) as overdue
        FROM todos
    `;
    const result = await runQuery(sql);
    return result.success ? result.data[0] : result;
};

module.exports = {
    findAll,
    findTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodoStats
};