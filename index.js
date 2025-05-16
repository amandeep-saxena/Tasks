const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const db = require("./config/db.config.js");
const cors = require('cors');


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(bodyParser.json());


 require("./routes/routes.js")(app)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
