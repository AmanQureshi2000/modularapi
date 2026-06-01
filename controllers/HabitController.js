const {
    getHabits,
    getArchivedHabits,
    getHabit,
    createHabit,
    updateHabit,
    archiveHabit,
    restoreHabit,
    deleteHabit
} = require('../models/Habit.js');

const {
    getCompletionsByHabit,
    getTodayCompletions,
    createCompletion,
    deleteCompletion
} = require('../models/HabitCompletion.js');

const {
    getStreakByHabit,
    getAllStreaks
} = require('../models/HabitStreak.js');

// List all active habits
const getAllHabits = async (req, res) => {
    try {
        const habits = await getHabits();
        res.json(habits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get archived habits
const getArchived = async (req, res) => {
    try {
        const habits = await getArchivedHabits();
        res.json(habits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single habit with its completions and streak
const getHabitById = async (req, res) => {
    try {
        const habit = await getHabit(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }
        
        // Get completions for this habit (last 30 days)
        const completions = await getCompletionsByHabit(req.params.id);
        const streak = await getStreakByHabit(req.params.id);
        
        res.json({ ...habit, completions, streak });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new habit
const createNewHabit = async (req, res) => {
    try {
        const result = await createHabit(req.body);
        res.status(201).json({ message: "Habit created successfully", habit: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a habit
const updateExistingHabit = async (req, res) => {
    try {
        const result = await updateHabit(req.params.id, req.body);
        if (!result) {
            return res.status(400).json({ message: "No data provided to update or habit not found" });
        }
        res.json({ message: "Habit updated successfully", habit: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Archive a habit
const archiveExistingHabit = async (req, res) => {
    try {
        const result = await archiveHabit(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Habit not found" });
        }
        res.json({ message: "Habit archived successfully", habit: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Restore an archived habit
const restoreArchivedHabit = async (req, res) => {
    try {
        const result = await restoreHabit(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Habit not found" });
        }
        res.json({ message: "Habit restored successfully", habit: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Permanently delete a habit
const deleteExistingHabit = async (req, res) => {
    try {
        await deleteHabit(req.params.id);
        res.json({ message: "Habit deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark habit as completed for today
const completeHabit = async (req, res) => {
    try {
        const { habitId } = req.params;
        const { notes } = req.body;
        
        // Check if habit exists
        const habit = await getHabit(habitId);
        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }
        
        const result = await createCompletion(habitId, notes);
        if (!result) {
            return res.status(400).json({ message: "Habit already completed today" });
        }
        
        // Get updated streak
        const streak = await getStreakByHabit(habitId);
        
        res.status(201).json({ 
            message: "Habit marked as completed", 
            completion: result,
            streak 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Unmark a habit completion
const uncompleteHabit = async (req, res) => {
    try {
        const { id } = req.params; // This is the completion ID
        const result = await deleteCompletion(id);
        
        if (!result) {
            return res.status(404).json({ message: "Completion record not found" });
        }
        
        res.json({ message: "Habit unmarked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get today's dashboard (all habits with completion status)
const getDashboard = async (req, res) => {
    try {
        const habits = await getHabits();
        const todayCompletions = await getTodayCompletions();
        const allStreaks = await getAllStreaks();
        
        // Map today's completions to habit IDs for easy lookup
        const completedTodayIds = todayCompletions.map(c => c.habit_id);
        
        // Enhance habits with today's completion status and streaks
        const habitsWithStatus = habits.map(habit => ({
            ...habit,
            completedToday: completedTodayIds.includes(habit.id),
            streak: allStreaks.find(s => s.habit_id === habit.id) || { current_streak: 0, longest_streak: 0 }
        }));
        
        res.json({
            date: new Date().toISOString().split('T')[0],
            habits: habitsWithStatus,
            stats: {
                totalHabits: habits.length,
                completedToday: todayCompletions.length,
                completionRate: habits.length ? Math.round((todayCompletions.length / habits.length) * 100) : 0
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
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
};