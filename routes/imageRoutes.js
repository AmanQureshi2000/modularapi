const express = require('express');
const router = express.Router();
const {
    uploadImage,
    getAllImages,
    getImageById,
    deleteImage
} = require('./imageController');

// POST /api/images - Create a new record
router.post('/', uploadImage);

// GET /api/images - Get all records
router.get('/', getAllImages);

// GET /api/images/:id - Get a specific record
router.get('/:id', getImageById);

// DELETE /api/images/:id - Remove a record
router.delete('/:id', deleteImage);

module.exports = router;