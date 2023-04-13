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
    } catch (err)
    {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
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