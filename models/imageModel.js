const { runQuery } = require('../config/db.js');

const ImageModel = {
    // Create
    create: async (fileName, fileUrl, mimeType, fileSize) => {
        const query = `
            INSERT INTO images (file_name, file_url, mime_type, file_size_bytes)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        return await runQuery(query, [fileName, fileUrl, mimeType, fileSize]);
    },

    // Read All
    findAll: async () => {
        return await runQuery('SELECT * FROM images ORDER BY created_at DESC;');
    },

    // Read One
    findById: async (id) => {
        return await runQuery('SELECT * FROM images WHERE id = $1;', [id]);
    },

    // Update (e.g., updating the name)
    updateName: async (id, newName) => {
        const query = 'UPDATE images SET file_name = $1 WHERE id = $2 RETURNING *;';
        return await runQuery(query, [newName, id]);
    },

    // Delete
    delete: async (id) => {
        return await runQuery('DELETE FROM images WHERE id = $1 RETURNING id;', [id]);
    }
};

module.exports = ImageModel;