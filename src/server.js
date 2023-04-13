const express = require("express");
const db = require("./db/context");

// =====================================================================
//  CONFIGRATION
// =====================================================================

// Fluent Configuration
const app = express()
    .disable('TRACE')
    .use(express.json());

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
 * Create a new books.
 *
 * @route POST /books
 * @group Books
 * @param {BookRequestBody.model} req.body.required - The book to create.
 * @returns {Book.model} 201 - The created book.
 * @returns {Error} 422 - ISBN is not valid.
 * @returns {Error} 500 - Internal server error.
 */
app.post('/books', async (req, res) =>
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
        if (exception.name === "ValidationError") {
            res.status(422).json({ message: Object.values(exception.errors).map(value => value.message) });
        } else {
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
app.put('/books/:id', async (req, res) =>
{
    try
    {
        const book = await db.Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const { isbn, genre, author, title } = req.body;        
        if (!(isbn && genre && author && title)) {
            return res.status(400).json({ message: 'Incomplete Data' });
        }    
        book.set({ isbn, genre, author, title });
        await book.save();
        res.status(200).json({ data: book });
    } catch (exception)
    {
        console.error(exception);
        if (exception.name === "ValidationError") {
            res.status(422).json({ message: Object.values(exception.errors).map(value => value.message) });
        } else {
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
app.patch('/books/:id', async (req, res) =>
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
        if (exception.name === "ValidationError") {
            res.status(422).json({ message: Object.values(exception.errors).map(value => value.message) });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// =====================================================================
//  SERVER LAUNCH
// =====================================================================

// If there's a problem with the DB connection, we don't want the Web API server to start.
db.connect().then(() =>
{
    app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}.`));
});