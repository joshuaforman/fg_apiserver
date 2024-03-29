var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';

var date = new Date();

module.exports = function(app, PairBondRelModel) {
  app.get('/api/v2/pairbondrels', auth.isAuthenticated, function(req,res) {
    winston.log(logLevel, date + ": in pairbondrels get");
    var user = req.decoded._doc.userName;
    PairBondRelModel.find(
      {
        user_id: user
      }, // filter object empty - to return all
      function(err, data) {
        if(err) {
          res.status(500).send("Error getting all pairbonds" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/pairbondrel/update', auth.isAuthenticated, function(req,res) {
    winston.log(logLevel, date + ': in parbondrels update');
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    PairBondRelModel.findOneAndUpdate(
      {
        _id: _id,
        user_id: user
      },
      {$set: set
      },
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500).send("Error updating pair bond relationship data" + err);
          return;
        }
        res.status(200).send(data);
      }
    );
  })

  // changed this so that you need to pass an object in the body. That object needs a 'field' and a 'value'. This way we can delete records not just based on the _id, but also call and remove all records for a certain personOne_id or personTwo_id, etc... Made this mostly so that when we delete a person, we can remove all the pairbonds related to them
  app.post('/api/v2/pairbondrel/delete', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in pairbondrel delete");
    var user = req.decoded._doc.userName;
    PairBondRelModel.remove(
      {
        [req.body.object.field]: req.body.object.value,
        user_id: user
      },
      function(err, data){
        if(err) {
          res.status(500).send("Error deleting pairBondRel" + err);
          return;
        }
        PairBondRelModel.find(
          {
            user_id: user
          }, // filter object - empty filter catches everything
          function(err, data) {
            if(err) {
              res.status(500);
              res.send("Error getting all pairBondRels after delete" + err);
              return;
            }
            res.status(200).send(JSON.stringify(data));
          }
        );
      }
    );
  });

  app.post('/api/v2/pairbondrel/create', auth.isAuthenticated,
  function(req,res){
    winston.log(logLevel, date + ": in pairbondrel create");
    var user = req.decoded._doc.userName;
    object = {
      personOne_id: req.body.object.personOne_id,
      personTwo_id: req.body.object.personTwo_id,
      relationshipType: req.body.object.relationshipType,
      subType: req.body.object.subType,
      startDateUser: req.body.object.startDateUser,
      startDate: req.body.object.startDate,
      endDateUser: req.body.object.endDateUser,
      endDate: req.body.object.endDate,
      user_id: user
    },
    new PairBondRelModel(object).save(function(err, data) {
      if(err) {
        console.log("Error creating PairBondRel: " + err)
        res.status(500).send("Error creating PairBondRel" + err);
        return;
      }
      res.status(200).send(JSON.stringify(data));
    });
  });

}
