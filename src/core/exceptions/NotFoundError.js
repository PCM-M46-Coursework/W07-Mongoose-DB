/**
 * Custom error class for resource not found errors.
 *
 * @class
 * @extends Error
 */
module.exports = class NotFoundError extends Error
{
    /**
     * Initialise a new instance of the {@link NotFoundError} class.
     * 
     * @param {String} message - The message to show to the user. Default: "Resource not found." 
     */
    constructor (message = "Resource not found.")
    {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}