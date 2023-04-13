require("./db/context")
    .connect()
    .then(() =>
    {
        const express = require("express");
        express()
            .disable('TRACE')
            .use(express.json())
            .use('/books', require("./routes/books"))
            .listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}.`));
    });