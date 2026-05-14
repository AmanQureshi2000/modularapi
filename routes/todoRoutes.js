const express = require('express');
const router = express.Router();
const {
    getAllTodos,
    getTodoById,
    CreateTodo,
    UpdateTodo,
    DeleteTodo,
    GetTodoStats,
    toggleComplete
} = require('../controllers/todoController');

// Routes
router.get('/', getAllTodos);
router.get('/stats', GetTodoStats);
router.get('/:id', getTodoById);
router.post('/', CreateTodo);
router.put('/:id', UpdateTodo);
router.delete('/:id', DeleteTodo);
router.patch('/:id/toggle', toggleComplete);

module.exports = router;