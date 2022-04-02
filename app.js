// import packages 
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// import helpers
const rootDir = require('./util/path');

// helpers
const publicPathHandler = path.join(rootDir, 'public');

// controllers
const errorController = require('./controllers/error')

// initialize express
const app = express();

// register EJS and where the views are located
app.set('view engine', 'ejs');
app.set('views', 'views'); 

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPathHandler));

// handling the routes / order matters / filter routes (1st param)
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// create and start the server
app.listen(3000);