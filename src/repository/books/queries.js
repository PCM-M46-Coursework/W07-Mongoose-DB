const db = require("../../db/context");
module.exports = {

    // =====================================================================
    //  QUERIES
    // =====================================================================

    /**
     * Get all books within the collection, optionally filtered by isbn, author, genre, or title.
     * 
     * @route GET /books
     * @group Books
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {object} 200 - A JSON object with all books that match the filter.
     * @returns {Error} 500 - Internal server error.
    */
    getMany: async (req, res) =>
    {
        try
        {
            const books = await db.Book.find(req.query);
            res.status(200).json({ message: "OK", data: books });
        } catch (err)
        {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    /**
     * Get a specific book, based on the SEO slug.
     * 
     * @route GET /books/book/:isbn
     * @group Books
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {object} 200 - A JSON object with the requested book.
     * @returns {Error} 404 - Book not found.
     * @returns {Error} 500 - Internal server error.
    */
    getSingle: async (req, res) =>
    {
        const { isbn } = req.params;
        try
        {
            const book = await db.Book.find({ isbn });
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.status(200).json({ message: "OK", data: book });
        } catch (err)
        {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};