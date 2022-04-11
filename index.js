const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // parse body requests before handling it
const cors = require('cors'); // restrict which domains can access
const {verifyToken} = require('./authChecks');
const User = require('./models/User');



// Import routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');


// Read .env and put it in process.env
dotenv.config();


// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to DB !')
);


// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


// Routes middlewares
app.use('/auth', authRoute);
app.use('*', verifyToken);
app.use('/users', usersRoute);


app.listen(3000, () => console.log('Server up and running !'));