const express = require('express');
const app = express();
const cors = require('cors');
const eventListener = require('./controller/eventListener');

app.use(cors());
app.use(express.json());

const routes = require("./routes/routes.js");

app.use("/", routes);


app.listen(8000, () => {
    console.log("Server is running on port 8000");
    eventListener.listen();
});