const express = require('express');

const app = express();
var cors = require('cors');
app.use(cors());
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));

app.use("/users", require("./controllers/userRouter"));