// import packages 
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// import helpers
const rootDir = require('./util/path');

// helpers
const publicPathHandler = path.join(rootDir, 'public');
const errorPathHandler = path.join(rootDir, 'views', '404.html');


// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// initialize express
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPathHandler));

// handling the routes / order matters / filter routes (1st param)
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(errorPathHandler, err => {
        console.log(err);
    });
});
// create and start the server
app.listen(3000);