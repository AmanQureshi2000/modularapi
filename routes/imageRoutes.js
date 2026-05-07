const express = require('express');
const router = express.Router();
const {
    uploadImage,
    getAllImages,
    getImageById,
    DeleteImage,
    UpdateImage
} = require('../controllers/imageController.js');

// POST /api/images - Create a new record
router.post('/', uploadImage);

// GET /api/images - Get all records
router.get('/', getAllImages);

// GET /api/images/:id - Get a specific record
router.get('/:id', getImageById);

// DELETE /api/images/:id - Remove a record
router.delete('/:id', DeleteImage);

router.put('/:id', UpdateImage);


module.exports = router;