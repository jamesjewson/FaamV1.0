const express = require('express')
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const path = require("path")
var cors = require('cors')

app.get('/test', (req, res) => { res.send('Hello from Express!') })


app.use(cors())



//.env config
dotenv.config()


//Connect to mongoDB
mongoose.connect(process.env.DB_STRING, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("Connected to MongoDB")
})


//if you use images path, don't make a request, just go to the folder
app.use("/images", express.static(path.join(__dirname, "public/images")))


//Body Parsing
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb'}))
app.use(helmet())
app.use(morgan("dev"))


app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

// Step 1:
app.use(express.static(path.resolve(__dirname, "../views/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../views/build", "index.html"));
});



// Set up server
app.listen(process.env.PORT)

