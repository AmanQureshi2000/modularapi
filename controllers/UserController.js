const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser
} = require('../models/User.js');

getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

getUserById = async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

createuser = async (req, res) => {
    try {
        const result = await createUser(req.body);
        res.status(201).json({ message: "User created successfully", result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

updateuser = async (req, res) => {
    try {
        const result = await updateUser(req.params.id, req.body);
        if (!result) {
            return res.status(400).json({ message: "No data provided to update" });
        }
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

deleteuser = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createuser,
    updateuser,
    deleteuser
}