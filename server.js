require("dotenv").config();
const express = require("express");
const app = express();

const methodOverride = require("method-override");
const morgan = require("morgan");
const authRoutes = require("./controllers/auth")
const session = require('express-session')

// Set the port from environment variable or default to 3000
const port = process.env.PORT || 3000;
const userController = require('./controllers/user')
//Middlewares
require('./db/connection')



// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('tiny'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))


//Routes

app.get('/',(req,res) => {
    res.render('index.ejs',{
        user: req.session.user,
        saveUninitialized:true,
        store: MongoStore.create({
            mongoUrl:process.env.MONGODB_URI
        })
    })
})



app.use( '/auth',authRoutes)
//ROutes below this you must be signed in

app.user('/users',userController)

app.get('/vip-louge',(req,res)=>{
    if(req.session.user){
    res.send(`Welcome to the party ${req.session.user.username}`)
    }else{
        req.send('Sorry no guest allowed')
    }
})


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
