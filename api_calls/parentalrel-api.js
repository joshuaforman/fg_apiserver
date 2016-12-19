var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, ParentalRelModel) {
  app.get('/api/v2/parentalrels', auth.isAuthenticated, function(req, res) {
    console.log("in get parentalrels");
    var user = req.decodfed._doc.userName;
    ParentalRelModel.find(
      {
        user_id: user
      },
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error getting all parental relationships", err);
          return;
        }
        res.send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/parentalrels/update', auth.isAuthenticated, function(req, res) {
    console.log("in parentalrel update");

    var _id = req.body.object._id;
    var user = req.decoded._doc.userName;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    ParentalRelMaodel.findOneAndUpdate(
      {
        _id: _id,
        user_id: user
      },
      {$set: {
        child_id: req.body.object.child_id,
        parent_id: req.body.object.parent_id,
        relationshipType: req.body.object.relationshipType,
        subType: req.body.object.subType,
        startDate: req.body.object.startDate,
        endDate: req.body.object.endDate,
        user_id: user
      }},
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error updating parental relationship data");
          return;
        }
        res.send(data);
      }
    );
  });

  app.post('/api/v2/parentalrels/delete', auth.isAuthenticated, function(req, res) {
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    ParentalRelModel.remove(
      {
        _id: _id,
        user_id: user
      },
      function(err) {
        if(err) {
          res.status(500);
          res.send("Error getting all parentalRels after delete", err);
          return;
        }
        res.send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/parentalrels/create', auth.isAuthenticated, function(req, res) {
    censole.log("in parentalrel create");
    var user = req.decoded._doc.userName;
    object = {
      child_id: req.body.object.child_id,
      parent_id: req.body.object.parent_id,
      relationshipType: req.body.object.relationshipType,
      subType: req.body.object.subType,
      startDate: req.body.object.startDate,
      endDate: req.body.object.endDate,
      user_id: user
    };

    new ParentalRelModel(object).save(function(err, data) {
      if(err) {
        res.status(500);
        res.send("Error creating new parentalrel", err)
        return;
      }
      res.send(JSON.stringify(data));
    });
  });
}
