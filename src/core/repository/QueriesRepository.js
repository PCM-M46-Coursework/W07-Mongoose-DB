const RepositoryBase = require("./RepositoryBase");
const NotFoundError = require("../exceptions/NotFoundError");

/**
 * A generic repository for handling read operations within a Mongoose database.
 * @class
 */
module.exports = class QueriesRepository extends RepositoryBase
{
    /**
     * Get all documents within the collection, optionally filtered by query string.
     * 
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {object} 200 - A JSON object with all documents that match the filter.
     * @returns {Error} 500 - Internal server error.
    */
    getMany = async (req, res) =>
    {
        try
        {
            const documents = await this.Model.find(req.query);
            res.status(200).json({ message: "OK", data: documents });
        }
        catch (exception)
        {
            return this._handleException(exception);
        }
    }

    /**
     * Get a single document from the collection.
     * 
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {object} 200 - A JSON object with the requested document.
     * @returns {Error} 404 - Document not found.
     * @returns {Error} 500 - Internal server error.
    */
    getSingle = async (req, res) =>
    {
        try
        {
            const document = await this.Model.find(req.params);
            if (!document) throw new NotFoundError();
            res.status(200).json({ message: "OK", data: document });
        }
        catch (exception)
        {
            return this._handleException(exception);
        }
    }

    /**
     * Responds with a header containing the current state of the resource without the body.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} 204 - No Content.
     * @returns {Error} 404 - Document not found.
     * @returns {Error} 500 - Internal server error.
     */
    head = async (route, req, res) =>
    {
        try
        {
            if (route == "/") return res.status(204).end();
            const document = await this.Model.find(req.params);
            if (!document) throw new NotFoundError();
            res.status(204).set('ETag', document.__v.toString()).end();
        }
        catch (exception)
        {
            return this._handleException(exception);
        }
    }
    
    /**
     * Responds with the allowed HTTP methods for a resource.
     *
     * @param {Object} res - The response object.
     * @returns {void} 204 - No Content.
     */
    options = async (_, res, allowedVerbsFactory) =>
    {
        res.set('Allow', allowedVerbsFactory());
        res.status(204).end();
    }
}