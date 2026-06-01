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

const { runQuery } = require('../config/db.js');

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

// Add this function to your HabitController
const getChartData = async (req, res) => {
    try {
        const habits = await getHabits();
        
        // Calculate weekly data (last 7 days)
        const weeklyLabels = [];
        const weeklyCompletions = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyLabels.push(dayName);
            
            // Count completions for this day
            let count = 0;
            for (const habit of habits) {
                const sql = `SELECT COUNT(*) FROM habit_completions 
                            WHERE habit_id = $1 AND completion_date = $2`;
                const result = await runQuery(sql, [habit.id, date.toISOString().split('T')[0]]);
                if (result.success && result.data[0].count > 0) count++;
            }
            weeklyCompletions.push(count);
        }
        
        // Calculate monthly data (by week)
        const monthlyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const monthlyCompletions = [0, 0, 0, 0];
        const monthlyMissed = [0, 0, 0, 0];
        
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        for (let week = 0; week < 4; week++) {
            const weekStart = new Date(firstDayOfMonth);
            weekStart.setDate(firstDayOfMonth.getDate() + (week * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            if (weekStart <= lastDayOfMonth) {
                for (const habit of habits) {
                    const sql = `SELECT COUNT(*) FROM habit_completions 
                                WHERE habit_id = $1 
                                AND completion_date BETWEEN $2 AND $3`;
                    const result = await runQuery(sql, [habit.id, weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]]);
                    const completed = result.success ? parseInt(result.data[0].count) : 0;
                    monthlyCompletions[week] += completed;
                    monthlyMissed[week] += (7 - completed);
                }
            }
        }
        
        res.json({
            weeklyData: {
                labels: weeklyLabels,
                completions: weeklyCompletions
            },
            monthlyData: {
                labels: monthlyLabels,
                completions: monthlyCompletions,
                missed: monthlyMissed
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
    getDashboard,
    getChartData
};