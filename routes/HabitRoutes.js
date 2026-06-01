const express = require('express');
const router = express.Router();
const {
    getAllHabits,
    getArchived,
    getHabitById,
    createNewHabit,
    updateExistingHabit,
    archiveExistingHabit,
    restoreArchivedHabit,
    deleteExistingHabit,
    completeHabit,
    uncompleteHabit,
    getDashboard
} = require('../controllers/HabitController.js');

// Dashboard routes
router.get('/dashboard', getDashboard);

// Habit CRUD routes
router.get('/', getAllHabits);
router.get('/archived', getArchived);
router.get('/:id', getHabitById);
router.post('/', createNewHabit);
router.put('/:id', updateExistingHabit);
router.patch('/:id/archive', archiveExistingHabit);
router.patch('/:id/restore', restoreArchivedHabit);
router.delete('/:id', deleteExistingHabit);

// Completion routes
router.post('/:habitId/complete', completeHabit);
router.delete('/completions/:id', uncompleteHabit);

module.exports = router;