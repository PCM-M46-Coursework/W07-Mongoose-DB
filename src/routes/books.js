const express = require('express');
const router = express.Router();
const { commands, queries, meta } = require("../repository").books;

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
router.post('/', commands.create);

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
router.put('/:id', commands.update);

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
router.patch('/:id', commands.patch);

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
router.delete('/:id', commands.deleteSingle);

/**
 * Truncates the books collection within the database. USE WITH CAUTION!
 *
 * @route DELETE /books
 * @group Books
 * @returns {void} 204 - No Content.
 * @returns {Error} 500 - Internal server error.
 */
router.delete('/', commands.deleteAll);

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
router.get('/', queries.getMany);

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
router.get('/book/:isbn', queries.getSingle);

// =====================================================================
//  META QUERIES
// =====================================================================

[
    { route: "/", allowedVerbs: "GET, POST, DELETE, OPTIONS, HEAD" },
    { route: "/:id", allowedVerbs: "PUT, PATCH, DELETE, OPTIONS, HEAD" },
    { route: "/book/:isbn", allowedVerbs: "GET, OPTIONS, HEAD" },
].forEach(({route, allowedVerbs}) => {

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
    router.options(route, (_, res) => meta.options(_, res, () => allowedVerbs));

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
    router.head(route, (req, res) => meta.options(route, req, res));
});

module.exports = router;