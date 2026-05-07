const{
    create,
    findAll,
    findById,
    updateName,
    Delete
} = require('../models/imageModel.js');

uploadImage = async (req, res) => {
    const { fileName, fileUrl, mimeType, fileSize } = req.body;
    
    if (!fileName || !fileUrl) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const result = await create(fileName, fileUrl, mimeType, fileSize);
    res.status(result.success ? 201 : 500).json(result);
};

getAllImages = async (req, res) => {
    const result = await findAll();
    res.status(result.success ? 200 : 500).json(result);
};

getImageById = async (req, res) => {
    const result = await findById(req.params.id);
    if (result.success && result.rowCount === 0) {
        return res.status(404).json({ success: false, error: "Image not found" });
    }
    res.status(result.success ? 200 : 500).json(result);
};

deleteImage = async (req, res) => {
    const result = await Delete(req.params.id);
    res.status(result.success ? 200 : 500).json(result);
};

updateImage = async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;
    const result = await updateName(id, newName);
    res.status(result.success ? 200 : 500).json(result);
};

module.exports = {
    uploadImage,
    getAllImages,
    getImageById,
    deleteImage,
    updateName
}