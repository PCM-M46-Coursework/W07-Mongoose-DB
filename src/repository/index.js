const CommandsRepository = require("./abstract/CommandsRepository");
const QueriesRepository = require("./abstract/QueriesRepository");
const { Book } = require("../db/context");

module.exports = {
    books: {
        commands: new CommandsRepository(Book),
        queries: new QueriesRepository(Book)
    }
};