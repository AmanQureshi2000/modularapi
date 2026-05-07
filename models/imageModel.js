const { runQuery } = require('../config/db.js');


   const create = async (fileName, fileUrl, mimeType, fileSize) => {
        const query = `
            INSERT INTO images (file_name, file_url, mime_type, file_size_bytes)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await runQuery(query, [fileName, fileUrl, mimeType, fileSize]);
        return result.success ? result.data[0] : result;
    };

    // Read All
    const findAll = async () => {
        const result = await runQuery('SELECT * FROM images ORDER BY created_at DESC;');
        return result.success ? result.data : result;
    };

    // Read One
    const findById = async (id) => {
        const result = await runQuery('SELECT * FROM images WHERE id = $1;', [id]);
        return result.success ? result.data[0] : result;
    };

    // Update (e.g., updating the name)
    const updateName = async (id, newName) => {
        const query = 'UPDATE images SET file_name = $1 WHERE id = $2 RETURNING *;';
        const result = await runQuery(query, [newName, id]);
        return result.success ? result.data[0] : result;
    };

    // Delete
    const Delete = async (id) => {
        return await runQuery('DELETE FROM images WHERE id = $1 RETURNING id;', [id]);
    };


module.exports = {
    create,
    findAll,
    findById,
    updateName,
    Delete
}