const CommandsRepository = require("./abstract/CommandsRepository");
const { Book } = require("../db/context");

module.exports = {
    books: {
        commands: new CommandsRepository(Book),
        queries: require("./books/queries"),
        meta: require("./books/meta")
    }
};