const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getBookById,
    createbook,
    updatebook,
    deletebook
} = require('../controllers/BookController.js');

// Map endpoints to controller functions
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createbook);
router.put('/:id', updatebook);
router.delete('/:id', deletebook);

module.exports = router;