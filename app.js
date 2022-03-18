// import packages 
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// import helpers
const rootDir = require('./util/path');

// helpers
const publicPathHandler = path.join(rootDir, 'public');
const errorPathHandler = path.join(rootDir, 'views', '404.html');

// initialize express
const app = express();

// register EJS and where the views are located
app.set('view engine', 'ejs');
app.set('views', 'views'); 

// routes
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPathHandler));

// handling the routes / order matters / filter routes (1st param)
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});
// create and start the server
app.listen(3000);