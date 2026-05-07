const {
    getImages,
    getImage,
    createImage,
    updateImage,
    deleteImage
} = require('../models/imageModel.js');

uploadImage = async (req, res) => {
    const { fileName, fileUrl, mimeType, fileSize } = req.body;
    
    if (!fileName || !fileUrl) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const result = await createImage(fileName, fileUrl, mimeType, fileSize);
    res.status(result.success === false ? 500 : 201).json(result);
};

getAllImages = async (req, res) => {
    const result = await getImages();
    res.status(result.success === false ? 500 : 200).json(result);
};

getImageById = async (req, res) => {
    const result = await getImage(req.params.id);
    if (!result || (result.success && result.rowCount === 0)) {
        return res.status(404).json({ success: false, error: "Image not found" });
    }
    res.status(result.success === false ? 500 : 200).json(result);
};

UpdateImage = async (req, res) => {
    const result = await updateImage(req.params.id, req.body.newName);
    res.status(result.success === false ? 400 : 200).json(result);
};

DeleteImage = async (req, res) => {
    const result = await deleteImage(req.params.id);
    res.status(result.success === false ? 500 : 200).json(result);
};

module.exports = {
    uploadImage,
    getAllImages,
    getImageById,
    UpdateImage,
    DeleteImage
};