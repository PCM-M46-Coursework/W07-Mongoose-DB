const express = require("express");
const db = require("./db/context");

// =====================================================================
//  CONFIGRATION
// =====================================================================

// Fluent Configuration
const app = express()
    .disable('TRACE')
    .use(express.json());

// =====================================================================
//  ROUTES
// =====================================================================

app.get("/", async (_, res) => {
    res.json({ message: "It Works!" });
});

// =====================================================================
//  SERVER LAUNCH
// =====================================================================

// If there's a problem with the DB connection, we don't want the Web API server to start.
db.connect().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}.`));
});