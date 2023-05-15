const express = require("express");
const router = require("./routes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {authGate} = require("./controllers/AuthController");
const todos = require('./routes/todo.routes');
const users = require('./routes/user.routes');
const auth = require('./routes/auth.routes');

const PORT = process.env.PORT;

const app = express();

app.use(cookieParser());
app.use(cors({origin: "http://localhost:8000", allowedHeaders: ['content-type', 'x-access-token', 'Authorization']}));

app.set('secretKey', process.env.JWT_WEB);

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(PORT, async () => {
    console.log(`server up on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.sendStatus(404).json({message: "Not found"});
    else
        res.sendStatus(500).json({message: "Something looks wrong :( !!!"});
    next();
});

app.use('/todos', authGate, todos);
app.use('/users', authGate, users);
app.use('/auth', auth);
app.use('/', router);
