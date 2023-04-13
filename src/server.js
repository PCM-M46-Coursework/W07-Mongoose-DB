const express = require("express");

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

app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}.`));