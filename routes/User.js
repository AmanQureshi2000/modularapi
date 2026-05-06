const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createuser,
    updateuser,
    deleteuser
} = require('../controllers/UserController.js');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createuser);
router.put('/:id', updateuser);
router.delete('/:id', deleteuser);

module.exports = router;