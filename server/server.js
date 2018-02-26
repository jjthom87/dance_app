// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");

var path = require("path");

var passport = require('passport');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
// Create a new express app
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 5000;

var models = require('./models');
models.sequelize.sync();

app.use(express.static('./client/public'));

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var routes = require('./controller/routes.js');
app.use('/', routes);

app.use(session({
	secret: 'lesson',
	store: new SequelizeStore({
		db: models.sequelize
 	}),
 	resave: true,
 	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// Starting our express server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});