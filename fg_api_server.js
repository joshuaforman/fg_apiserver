var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

// the following are for passport.js and authentication
var passport = require('passport');
var jwt    = require('jsonwebtoken');
var initPassport = require('./passport/init');
var config = require('./config');
var flash = require('connect-flash');
var session = require('express-session');
// var cookieParser = require('cookie-parser');
var user;

mongoose.connect('mongodb://appadmin:familygenie@localhost/test');

// BEGIN Mongoose Models
var PersonModel = require('./models/person.model.js')(mongoose);
var PairBondRelModel = require('./models/pairbond-relationship.model.js')(mongoose, PersonModel);
var ParentalRelModel = require('./models/parental-relationship.model.js')(mongoose, PersonModel);
var ParentalRelTypeModel = require('./models/parentalreltype.model.js')(mongoose, PersonModel);
var PersonChangeModel = require('./models/personchange.model.js')(mongoose, PersonModel);
var EventsModel = require('./models/events.model.js')(mongoose, PersonModel);

var StagedPersonModel = require('./models/staged-person.model.js')(mongoose, PersonModel);
var StagedEventsModel = require('./models/staged-events.model.js')(mongoose, PersonModel);
var StagedPairBondRelModel = require('./models/staged-pairbond-relationship.model.js')(mongoose, PersonModel);
var StagedParentalRelModel = require('./models/staged-parental-relationship.model.js')(mongoose, PersonModel);

var UserLogModel = require('./models/user-log.model.js')(mongoose);
// END Mongoose Models

var app = express();

// the following are for passport.js
app.set('jwtSecret', config.jwtSecret);
app.use(passport.initialize());
// trying to get flash to work, I needed to
// app.use(cookieParser());
// app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
initPassport(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

app.use(function(req, res, next) {
	next();
});

require('./passport/passport.routes')(app,passport);
// this is gedcom uploads page
require('./gedcom/gedcom.js')(app, mongoose, bodyParser, passport);
require('./api_calls/person-api')(app, PersonModel);
require('./api_calls/events-api')(app, EventsModel);
require('./api_calls/pairbondrels-api')(app, PairBondRelModel);
require('./api_calls/parentalrel-api')(app, ParentalRelModel);
require('./api_calls/parentalreltypes-api')(app, ParentalRelTypeModel);

require('./api_calls/stagedpeople-api')(app, StagedPersonModel);
require('./api_calls/newperson-api.js')(app, PersonModel, EventsModel, ParentalRelModel);
require('./api_calls/stagedEvents-api.js')(app, StagedEventsModel);
require('./api_calls/stagedpairbondrels-api.js')(app, StagedPairBondRelModel);
require('./api_calls/stagedparentalrels-api.js')(app, StagedParentalRelModel);

require('./functions/import-script.js')(app, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel, ParentalRelModel, StagedParentalRelModel, PairBondRelModel, StagedPairBondRelModel);

require('./api_calls/userlog-api.js')(app, UserLogModel);

app.use(function(req, res, next) {
	res.status(404);
	res.send("Not found here, try somewhere else maybe?");
});

app.listen(3500, function() {
	console.log("Ready to go: 3500");
});

module.exports = app;
