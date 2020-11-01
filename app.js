//we are creating server by using express

const express = require("express")
const http = require("http");

//set the port number
const port = process.env.PORT || 3000;

const app = express()

//using passport for authentication
var passport = require("passport");

//import users route
var usersRouter = require("./routes/users");

//using mongoose package to connect mongodb database

const mongoose = require("mongoose")
var config = require("./config")

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

connect.then(() => {
    console.log("connected correctly to the database")
})



app.use(passport.initialize());

app.get("/", (req,res) => {
    res.send('we are at home')
})

//using users route in app
app.use("/users", usersRouter);

//creating server
const server = http.createServer(app);

server.listen(port);