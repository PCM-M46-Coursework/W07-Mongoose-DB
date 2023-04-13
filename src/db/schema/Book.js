const mongoose = require("mongoose");
const validateISBN = require("../validators/validateISBN");

module.exports = mongoose.model("Book", new mongoose.Schema({
    isbn: {
        type: String,
        required: [true, "The book must have a valid ISBN."],
        unique: [true, "The ISBN for any given book must be unique."],
        validate: {
            validator: validateISBN,
            message: props => `${props.value} is not a valid ISBN!`
        }
    },
    genre: {
        type: String,
        required: [true, "The book must have a genre."],
        unique: false
    },
    author: {
        type: String,
        required: [true, "The book must have an author."],
        unique: false
    },
    title: {
        type: String,
        required: [true, "The book must have a title."],
        unique: false
    }
}));