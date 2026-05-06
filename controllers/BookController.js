const {
    getBooks,
    getBook,
    updateBook,
    deleteBook,
    createBook
} = require('../models/Book.js');

// List all books
getAllBooks = async (req, res) => {
    try {
        const books = await getBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Find one book
getBookById = async (req, res) => {
    try {
        const book = await getBook(req.params.id);
        if (!book || book.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book); // Return the single object rather than an array
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a book
createbook = async (req, res) => {
    try {
        const result = await createBook(req.body);
        res.status(201).json({ message: "Book created successfully", result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a book
updatebook = async (req, res) => {
    try {
        const result = await updateBook(req.params.id, req.body);
        if (!result) {
            return res.status(400).json({ message: "No data provided to update" });
        }
        res.json({ message: "Book updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a book
deletebook = async (req, res) => {
    try {
        await deleteBook(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createbook,
    updatebook,
    deletebook
}