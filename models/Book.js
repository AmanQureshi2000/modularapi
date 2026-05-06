const { runQuery } = require('../config/db.js');

const getBooks = async () => {
    let sql = `SELECT * FROM books`;
    const result = await runQuery(sql);
    return result.success ? result.data : result;
}

const getBook = async (id) => {
    let sql = `SELECT * FROM books WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    return result.success ? result.data[0] : result;
}

const updateBook = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return { success: false, error: 'No data provided' };
    
    const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
        
    // Added RETURNING * to match the return pattern used in the User models
    const sql = `UPDATE books SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const values = [...Object.values(data), id];
    
    const result = await runQuery(sql, values);
    return result.success ? result.data[0] : result;
};

const deleteBook = async (id) => {
    let sql = `DELETE FROM books WHERE id = $1`;
    const result = await runQuery(sql, [id]);
    return result;
}

const createBook = async (data) => {
    const { title, author, isbn, price, stock_count, published_date } = data;
    
    let sql = `INSERT INTO books (title, author, isbn, price, stock_count, published_date) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
               
    const result = await runQuery(sql, [title, author, isbn, price, stock_count, published_date]);
    return result.success ? result.data[0] : result;
}

module.exports = { getBooks, getBook, updateBook, deleteBook, createBook };