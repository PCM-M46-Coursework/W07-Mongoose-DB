const RepositoryBase = require("./RepositoryBase");
const NotFoundError = require("../exceptions/NotFoundError");

/**
 * A generic repository for handling write operations within a Mongoose database.
 * @class
 */
module.exports = class CommandsRepository extends RepositoryBase
{
    /**
     * Create a new document within the collection.
     *
     * @param {model} req.body.required - The model to create.
     * @returns {model} 201 - The created model.
     * @returns {Error} 422 - Validation errors.
     * @returns {Error} 500 - Internal server error.
     */
    create = async (req, res) =>
    {
        try
        {
            const result = Array.isArray(req.body)
                ? await this.Model.insertMany(req.body)
                : await this.Model.create(req.body);
            res.status(201).json({ message: "OK", data: result });
        }
        catch (exception)
        {
            return this._handleException(exception);
        }
    }

    /**
     * Update a document within the database. All fields are required for update.
     *
     * @param {string} id.path.required - The model's ID.
     * @param {model} model.body.required - The updated model.
     * @returns {model} 200 - The updated model.
     * @returns {Error} 404 - Document Not Found.
     * @returns {Error} 422 - Validation errors.
     * @returns {Error} 500 - Internal server error.
     */
    update = async (req, res) =>
    {
        try
        {
            const document = await this.Model.findById(req.params.id);
            if (!document) throw new NotFoundError();

            const error = await new this.Model(req.body).validate();            
            if (error) throw new Error(error);

            document.set(req.body);
            await document.save();
            res.status(200).json({ data: document });
        }
        catch (exception)
        {
            return this._handleException(exception);
        }
    }

     /**
     * Update a model within the database. Partial updates are allowed.
     *
     * @param {string} id.path.required - The model's ID.
     * @param {model} model.body.required - The updated model.
     * @returns {model} 200 - The updated model.
     * @returns {Error} 404 - Document Not Found.
     * @returns {Error} 422 - Validation errors.
     * @returns {Error} 500 - Internal server error.
     */
     patch = async (req, res) =>
     {
        try
        {
            const document = await this.Model.findById(req.params.id);
            if (!document) throw new NotFoundError();

            document.set(req.body);
            await document.save();
            res.status(200).json({ data: document });
        }
        catch (exception)
        {
            return this._handleException(exception);
        }
     }
     

    /**
     * Delete a document from the database.
     *
     * @param {string} id.path.required - The model's ID.
     * @returns {void} 204 - No Content.
     * @returns {Error} 404 - Document Not Found.
     * @returns {Error} 500 - Internal server error.
     */
    deleteSingle = async (req, res) =>
    {
        try
        {
            let document = await this.Model.findById(req.params.id);
            if (!document) throw new NotFoundError();
            await document.deleteOne();
            res.status(204).end();
        } catch (err)
        {
            return this._handleException(exception);
        }
    }

    /**
     * Truncates the collection within the database. USE WITH CAUTION!
     *
     * @returns {void} 204 - No Content.
     * @returns {Error} 500 - Internal server error.
     */
    deleteAll = async (req, res) =>
    {
        try
        {
            await this.Model.deleteMany({});
            res.status(204).end();
        } catch (err)
        {
            return this._handleException(exception);
        }
    }
}