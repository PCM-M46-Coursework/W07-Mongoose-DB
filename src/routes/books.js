const express = require('express');
const db = require("../db/context");
const router = express.Router();

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
router.post('/', async (req, res) =>
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
            res.status(422).json({ message: Object.values(exception.errors).map(value => value.message) });
        } else
        {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

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
router.put('/:id', async (req, res) =>
{
    try
    {
        const book = await db.Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const { isbn, genre, author, title } = req.body;
        if (!(isbn && genre && author && title))
        {
            return res.status(400).json({ message: 'Incomplete Data' });
        }
        book.set({ isbn, genre, author, title });
        await book.save();
        res.status(200).json({ data: book });
    } catch (exception)
    {
        console.error(exception);
        if (exception.name === "ValidationError")
        {
            res.status(422).json({ message: Object.values(exception.errors).map(value => value.message) });
        } else
        {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

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
router.patch('/:id', async (req, res) =>
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
            res.status(422).json({ message: Object.values(exception.errors).map(value => value.message) });
        } else
        {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

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
router.delete('/:id', async (req, res) =>
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
});

/**
 * Truncates the books collection within the database. USE WITH CAUTION!
 *
 * @route DELETE /books
 * @group Books
 * @returns {void} 204 - No Content.
 * @returns {Error} 500 - Internal server error.
 */
router.delete('/', async (_, res) =>
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
});

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
router.get('/', async (req, res) =>
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
});

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
router.get('/book/:isbn', async (req, res) =>
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
});

// =====================================================================
//  META QUERIES (OPTIONS)
// =====================================================================

/**
 * Responds with the allowed HTTP methods for a resource.
 *
 * @route OPTIONS /books
 * @group Books
 * @param {Object} res - The response object.
 * @returns {void} 204 - No Content.
 */
router.options('/', (_, res) =>
{
    res.set('Allow', 'GET, POST, DELETE, OPTIONS, HEAD');
    res.status(204).end();
});

/**
 * Responds with the allowed HTTP methods for a resource.
 *
 * @route OPTIONS /books/:id
 * @group Books
 * @param {Object} res - The response object.
 * @returns {void} 204 - No Content.
 */
router.options('/:id', (_, res) =>
{
    res.set('Allow', 'PUT, PATCH, DELETE, OPTIONS, HEAD');
    res.status(204).end();
});

/**
 * Responds with the allowed HTTP methods for a resource.
 *
 * @route OPTIONS /books/book/:isbn
 * @group Books
 * @param {Object} res - The response object.
 * @returns {void} 204 - No Content.
 */
router.options('/book/:isbn', (_, res) =>
{
    res.set('Allow', 'GET, OPTIONS, HEAD');
    res.status(204).end();
});

// =====================================================================
//  META QUERIES (HEAD)
// =====================================================================

/**
 * Responds with a header containing the current state of the resource without the body.
 *
 * @route HEAD /books
 * @group Books
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} 204 - No Content.
 * @returns {Error} 404 - Book not found.
 * @returns {Error} 500 - Internal server error.
 */
router.head('/', async (_, res) =>
{
    try
    {
        res.status(204).end();
    } catch (err)
    {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Responds with a header containing the current state of the resource without the body.
 *
 * @route HEAD /books/:id
 * @group Books
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} 204 - No Content.
 * @returns {Error} 404 - Book not found.
 * @returns {Error} 500 - Internal server error.
 */
router.head('/:id', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const book = await db.Book.findById(id);
        if (!book)
        {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).set('ETag', book.__v.toString()).end();
    } catch (err)
    {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Responds with a header containing the current state of the resource without the body.
 *
 * @route HEAD /books/book/:isbn
 * @group Books
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} 204 - No Content.
 * @returns {Error} 404 - Book not found.
 * @returns {Error} 500 - Internal server error.
 */
router.head('/book/:isbn', async (req, res) =>
{
    const { isbn } = req.params;
    try
    {
        const book = await db.Book.find({ isbn });
        if (!book)
        {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).set('ETag', book.__v.toString()).end();
    } catch (err)
    {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;