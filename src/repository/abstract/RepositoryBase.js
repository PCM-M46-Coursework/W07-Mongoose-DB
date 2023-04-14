/**
 * A generic repository for handling read operations within a Mongoose database.
 * @class
 */
module.exports = class RepositoryBase
{
    /**
     * Initialise a new instance of the {@link RepositoryBase} class.
     * 
     * @param {Mongoose#Model} model - The collection within the database.
     */
    constructor(model)
    {
        this.Model = model;
    }
    
    /**
     * Returns different status codes and messages, based on the expection that is being handled.
     * 
     * @param {object} exception - The exception to handle.
     * @returns {Error} 404 - 'Document not found'.
     * @returns {Error} 422 - Validation errors.
     * @returns {Error} 500 - Internal server error.
     */
    _handleException(exception)
    {
        console.dir(exception);
        switch(exception.name) {
            case 'NotFoundError':
                return res.status(404).json({ message: 'Document not found' });
            case 'ValidationError':
                return res.status(422).json({ message: exception.errors.map(e => e.message ) });
            default:
                return res.status(500).json({ message: 'Internal server error' });
        }
    }
}