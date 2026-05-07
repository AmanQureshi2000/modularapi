const { runQuery } = require('../config/db.js');

const getImages = async () => {
    const sql = `SELECT * FROM images ORDER BY created_at DESC`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
};

const getImage = async (id) => {
    const sql = `SELECT * FROM images WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    if (result.success) {
        return result.data.length > 0 ? result.data[0] : null;
    }
    return result;
};

const createImage = async (data) => {
    const { fileName, fileUrl, mimeType, fileSize } = data;
    const sql = `INSERT INTO images (file_name, file_url, mime_type, file_size_bytes) 
                 VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await runQuery(sql, [fileName, fileUrl, mimeType, fileSize]);
    return result.success ? result.data[0] : result;
};

const updateImage = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return { success: false, error: 'No data provided' };
    
    // Dynamically maps keys to SQL columns (e.g., fileName -> file_name if necessary, 
    // but assuming data keys match DB columns per Computer.js style)
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const sql = `UPDATE images SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    const result = await runQuery(sql, [...Object.values(data), id]);
    return result.success ? result.data[0] : result;
};

const deleteImage = async (id) => {
    const sql = `DELETE FROM images WHERE id = $1`;
    return await runQuery(sql, [id]);
};

module.exports = { 
    getImages, 
    getImage, 
    createImage, 
    updateImage, 
    deleteImage 
};