const db = require("../../db/context");
module.exports = {

    // =====================================================================
    //  META QUERIES (OPTIONS)
    // =====================================================================

    /**
     * Responds with the allowed HTTP methods for a resource.
     *
     * @route OPTIONS /books
     * @route OPTIONS /books/:id
     * @route OPTIONS /books/book/:isbn
     * @group Books
     * @param {Object} res - The response object.
     * @returns {void} 204 - No Content.
     */
    options: async (route, res) =>
    {
        res.set('Allow', (() =>
        {
            switch (route)
            {
                case "/": return 'GET, POST, DELETE, OPTIONS, HEAD';
                case "/:id": return 'PUT, PATCH, DELETE, OPTIONS, HEAD';
                case "/book/:isbn": return 'GET, OPTIONS, HEAD';
                default: return '';
            }
        })());
        res.status(204).end();
    },

    // =====================================================================
    //  META QUERIES (HEAD)
    // =====================================================================

    /**
     * Responds with a header containing the current state of the resource without the body.
     *
     * @route HEAD /books
     * @route HEAD /books/:id
     * @route HEAD /books/book/:isbn
     * @group Books
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} 204 - No Content.
     * @returns {Error} 404 - Book not found.
     * @returns {Error} 500 - Internal server error.
     */
    head: async (route, req, res) =>
    {
        try
        {
            if (route == "/") return res.status(204).end();
            const book = (route == "/:id")
                ? await db.Book.findById(req.params.id)
                : await db.Book.find({ isbn: req.params.isbn });
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.status(204).set('ETag', book.__v.toString()).end();
        } catch (err)
        {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};