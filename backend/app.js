const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser('secret'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({ credentials: true, origin: true, withCredentials: true }));

// Routes
const user = require('./routes/userRoute');
app.use('/api/v1', user);

// Deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('server on');
    });
}

// Error Middleware
module.exports = app;
