const db = require("../../db/context");
module.exports =
{
    // =====================================================================
    //  COMMANDS
    // =====================================================================

    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

    /**
    * @typedef {object} BookRequestBody
    * @property {string} isbn - The book's ISBN as ISBN-10 or ISBN-13.
    * @property {string} genre - The book's genre.
    * @property {string} author - The book's author.
    * @property {string} title - The book's title.
    */

    /**
     * Create a new book.
     *
     * @route POST /books
     * @group Books
     * @param {BookRequestBody.model} req.body.required - The book to create.
     * @returns {Book.model} 201 - The created book.
     * @returns {Error} 422 - ISBN is not valid.
     * @returns {Error} 500 - Internal server error.
     */
    create: async (req, res) =>
    {
        try
        {
            const result = Array.isArray(req.body)
                ? await db.Book.insertMany(req.body)
                : await db.Book.create(req.body);
            res.status(201).json({ message: "OK", data: result });
        } catch (exception)
        {
            console.error(exception);
            if (exception.name === "ValidationError")
            {
                res.status(422).json({ message: exception.errors.map(e => e.message ) });
            } else
            {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },

    /**
     * Update a book within the database. All fields are required for update.
     *
     * @route PUT /books/:id
     * @group Books
     * @param {string} id.path.required - The book's ID.
     * @param {BookRequestBody.model} book.body.required - The updated book.
     * @returns {Book.model} 200 - The updated book.
     * @returns {Error} 400 - Incomplete Data.
     * @returns {Error} 404 - Book not found.
     * @returns {Error} 422 - ISBN is not valid.
     * @returns {Error} 500 - Internal server error.
     */
    update: async (req, res) =>
    {
        try
        {
            const book = await db.Book.findById(req.params.id);            
            if (!book) return res.status(404).json({ message: 'Book not found' });

            const error = await new db.Book(req.body).validate();
            if (error) return res.status(422).json({ message: error.errors.map(e => e.message ) });

            book.set(req.body);
            await book.save();
            res.status(200).json({ data: book });
        }
        catch (exception)
        {
            console.error(exception);
            if (exception.name === "ValidationError")
            {
                res.status(422).json({ message: exception.errors.map(e => e.message ) });
            } else
            {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },

    /**
     * Update a book within the database. Partial updates are allowed.
     *
     * @route PATCH /books/:id
     * @group Books
     * @param {string} id.path.required - The book's ID.
     * @param {BookRequestBody.model} book.body.required - The updated book.
     * @returns {Book.model} 200 - The updated book.
     * @returns {Error} 404 - Book not found.
     * @returns {Error} 422 - ISBN is not valid.
     * @returns {Error} 500 - Internal server error.
     */
    patch: async (req, res) =>
    {
        const { id } = req.params;
        try
        {
            let book = await db.Book.findById(id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            book.set(req.body);
            await book.save();
            res.status(200).json({ data: book });
        } catch (exception)
        {
            console.error(exception);
            if (exception.name === "ValidationError")
            {
                res.status(422).json({ message: exception.errors.map(e => e.message ) });
            } else
            {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },

    /**
     * Delete a book from the database.
     *
     * @route DELETE /books/:id
     * @group Books
     * @param {string} id.path.required - The book's ID.
     * @returns {void} 204 - No Content.
     * @returns {Error} 404 - Book not found.
     * @returns {Error} 500 - Internal server error.
     */
    deleteSingle: async (req, res) =>
    {
        try
        {
            let book = await db.Book.findById(req.params.id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            await book.deleteOne();
            res.status(204).end();
        } catch (err)
        {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    /**
     * Truncates the books collection within the database. USE WITH CAUTION!
     *
     * @route DELETE /books
     * @group Books
     * @returns {void} 204 - No Content.
     * @returns {Error} 500 - Internal server error.
     */
    deleteAll: async (_, res) =>
    {
        try
        {
            await db.Book.deleteMany({});
            res.status(204).end();
        } catch (err)
        {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};