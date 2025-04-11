const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const app = express();
const db = require("./config/db.config.js");
const errorHandler = require('./middleware/error.middleware.js');

const cors = require('cors');
 require('./cron/taskReminder.js');



app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(errorHandler);
app.use(express.json());
app.use(bodyParser.json());




require("./routes/routes.js")(app)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
