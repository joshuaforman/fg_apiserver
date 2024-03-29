var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app, StagedPairBondRelModel) {
  app.get('/api/v2/staging/pairbondrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in get staged pairbonds");
    var user = req.decoded._doc.userName;
    StagedPairBondRelModel.find(
      { user_id: user },
      function(err, data) {
        if (err) {
          res.status(500).send("Error getting all staged pairbonds" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    )
  });

  app.post('/api/v2/staging/pairbondrel/update', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in update staged pairbondrels");
    var user = req.decoded._doc.userName;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    StagedPairBondRelModel.findOneAndUpdate(
      {
        _id: req.body.object._id,
        user_id: user
      },
      { $set : set },
      { new : true },
      function(err, data) {
        if(err) {
          res.status(500).send('error updating staged pairbond relationship' + err)
        }
        res.status(200).send(data);
      })
  })
}
