/**
 * A generic repository for handling write operations within a Mongoose database.
 * @class
 */
module.exports = class CommandsRepository
{
    /**
     * Initialise a new instance of the {@link CommandsRepository} class.
     * 
     * @param {Mongoose#Model} model - The name of the model within the database.
     */
    constructor(model)
    {
        this.Model = model;
    }

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
            return this.#_handleException(exception);
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
            const model = await this.Model.findById(req.params.id);
            if (!model) return res.status(404).json({ message: 'Document Not Found' });

            const error = await new this.Model(req.body).validate();            
            if (error) throw new Error(error);

            model.set(req.body);
            await model.save();
            res.status(200).json({ data: model });
        }
        catch (exception)
        {
            return this.#_handleException(exception);
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
            const model = await this.Model.findById(req.params.id);
            if (!model) return res.status(404).json({ message: 'Document Not Found' });

            model.set(req.body);
            await model.save();
            res.status(200).json({ data: model });
        }
        catch (exception)
        {
            return this.#_handleException(exception);
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
            let model = await this.Model.findById(req.params.id);
            if (!model) return res.status(404).json({ message: 'Document Not Found' });
            await model.deleteOne();
            res.status(204).end();
        } catch (err)
        {
            return this.#_handleException(exception);
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
            return this.#_handleException(exception);
        }
    }

    /**
     * Returns different status codes and messages, based on the expection that is being handled.
     * 
     * @param {object} exception - The exception to handle.
     * @returns {Error} 422 - Validation errors.
     * @returns {Error} 500 - Internal server error.
     */
    #_handleException(exception)
    {
        console.dir(exception);
        switch(exception.name) {
            case 'ValidationError':
                return res.status(422).json({ message: exception.errors.map(e => e.message ) });
            default:
                return res.status(500).json({ message: 'Internal server error' });
        }
    }
}