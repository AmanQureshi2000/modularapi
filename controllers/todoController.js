const {
    findAll,
    findTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodoStats
} = require('../models/Todo.js');

getAllTodos = async (req, res) => {
    const { status, priority, search } = req.query;
    const filters = { status, priority, search };
    const result = await findAll(filters);
    res.status(result.success === false ? 500 : 200).json(result);
};

getTodoById = async (req, res) => {
    const result = await findTodoById(req.params.id);
    if (!result || (result.success && (!result.data || result.rowCount === 0))) {
        return res.status(404).json({ success: false, error: "Todo not found" });
    }
    res.status(result.success === false ? 500 : 200).json(result);
};

CreateTodo = async (req, res) => {
    const { title, description, priority, due_date } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const todoData = {
        title: title.trim(),
        description: description || null,
        priority: priority || 'medium',
        due_date: due_date || null
    };

    const result = await createTodo(todoData);
    res.status(result.success === false ? 500 : 201).json(result);
};

UpdateTodo = async (req, res) => {
    const updates = req.body;
    
    // Validate status if provided
    if (updates.status && !['pending', 'in_progress', 'completed', 'archived'].includes(updates.status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    // Validate priority if provided
    if (updates.priority && !['low', 'medium', 'high', 'urgent'].includes(updates.priority)) {
        return res.status(400).json({ success: false, error: 'Invalid priority' });
    }

    const result = await updateTodo(req.params.id, updates);
    res.status(result.success === false ? 400 : 200).json(result);
};

DeleteTodo = async (req, res) => {
    const result = await deleteTodo(req.params.id);
    res.status(result.success === false ? 500 : 200).json(result);
};

GetTodoStats = async (req, res) => {
    const result = await getTodoStats();
    res.status(result.success === false ? 500 : 200).json(result);
};

toggleComplete = async (req, res) => {
    const result = await findTodoById(req.params.id);
    if (!result || (result.success && (!result.data || result.rowCount === 0))) {
        return res.status(404).json({ success: false, error: "Todo not found" });
    }
    
    if (result.success === false) {
        return res.status(500).json(result);
    }
    
    const newStatus = result.status === 'completed' ? 'pending' : 'completed';
    const updatedResult = await updateTodo(req.params.id, { status: newStatus });
    res.status(updatedResult.success === false ? 400 : 200).json(updatedResult);
};

module.exports = {
    getAllTodos,
    getTodoById,
    CreateTodo,
    UpdateTodo,
    DeleteTodo,
    GetTodoStats,
    toggleComplete
};