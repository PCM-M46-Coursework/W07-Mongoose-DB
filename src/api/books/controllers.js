const CommandsRepository = require("../../core/repository/CommandsRepository");
const QueriesRepository = require("../../core/repository/QueriesRepository");
const Book = require("./model/Book");

module.exports = {
    commands: new CommandsRepository(Book),
    queries: new QueriesRepository(Book)
};