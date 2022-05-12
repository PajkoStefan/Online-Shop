// import packages
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// helpers & handlers
const rootDir = require('./util/path');
const publicPathHandler = path.join(rootDir, 'public');
const db = require('./util/database');

// controllers
const errorController = require('./controllers/error');

// initialize express
const app = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// enable body parser & static files
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicPathHandler));

// routes
// import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


db.execute('SELECT * FROM products')
.then( result => {
    console.log(result[0]);
    // console.log(result[1]);
})
.catch( err => {
    console.log(err);
});

// enable routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);


// create and start the server
app.listen(3000);