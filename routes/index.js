var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

/*GET info about one bird*/
router.get('/bird/:_id', function(req, res, next){

  Bird.findOne( { _id: req.params._id })
    .then( (doc) => {
      if (doc) {
        doc.datesSeen = doc.datesSeen = doc.datesSeen.sort( function(a, b) {
          if (a && b) {
            return b.getTime() - a.getTime();
          }
        });
        res.render('bird', { bird: doc });
      } else {
        res.status(404);
        next(Error("Bird not found"));
      }
    })
    .catch( (err) => {
      next(err);
    });

});

/*GET info about one bird to edit*/
router.get('/edit/:_id', function(req, res, next){

  Bird.findOne( { _id: req.params._id })
    .then( (doc) => {
      if (doc) {
        res.render('edit', { bird: doc });
      } else {
        res.status(404);
        next(Error("Bird to edit not found"));
      }
    })
    .catch( (err) => {
      next(err);
    });

});

/* GET home page. */
router.get('/', function(req, res, next) {

  Bird.find().select( { name: 1, description: 1 } ).sort( {name: 1} )
    .then( ( docs ) => {
      console.log(docs);
      res.render('index', { title: 'All Birds', birds: docs });
    }).catch( (err) => {
      next(err)
    });
});

router.post('/addBird', function(req, res, next) {

  var bird = Bird(req.body);

  bird.nest = {
    location: req.body.nestLocation,
    material: req.body.nestMaterials
  }

  bird.save()
    .then( (doc) => {
      //console.log(doc);
      res.redirect('/')
    })
    .catch( (err) => {

      if (err.name === 'ValidationError') {

        req.flash('error', err.message);
        res.redirect('/');
      }

      else{
        next(err);
      }
    });
});

router.post('/edit/:_id', function(req, res, next){

  Bird.findOneAndUpdate( {_id: req.params._id},
     {$set: { description: req.body.description, height: req.body.height,
      averageEggs: req.body.averageEggs, nest: {location: req.body.nestLocation,
      material: req.body.nestMaterials} } }, {runValidators: true})
      /*updates description, height, averageEggs and nest information then runs
      validation but according to mongoose the update and findOneAndUpdate do not
      support validation. An alternitive could be a promise chain to find the
      object copy and store it's data then delete the original and create a new
      object using the collected information and save the new object and run validation*/  
    .then( (doc) => {
      if (doc) {
        res.redirect('/bird/'+ req.params._id);
      }
      else {
        res.status(404); next(Error("Attempt to edit bird not in database"))
      }
    })
    .catch( (err) => {

      console.log(err);

      if (err.name === 'ValidatorError') {
        req.flash('error', err.message);
        res.redirect('/edit/' + req.params._id);
      }
      else {
        next(err);
      }
    });
});

router.post('/delete', function(req, res, next){

  Bird.deleteOne( { _id : req.body._id } ) //deletes object from database based on id
    .then( (doc) => {

      res.redirect('/');//back to home page
    })
    .catch((err) => {
      next(err);
    });

  });

/*POST to add a new sighting for a bird*/
router.post('/addSighting', function(req, res, next){

  Bird.findOneAndUpdate( {_id: req.body._id}, {$push: { datesSeen: req.body.date } }, {runValidators: true})
    .then( (doc) => {
      if (doc) {
        res.redirect('/bird/'+ req.body._id);
      }
      else {
        res.status(404); next(Error("Attempt to add sighting to bird not in database"))
      }
    })
    .catch( (err) => {

      console.log(err);

      if (err.name === 'CastError') {
        req.flash('error', 'Date must be in a valid date format');
        res.redirect('/bird/' + req.body._id);
      }
      else if (err.name === 'ValidatorError') {
        req.flash('error', err.message);
        res.redirect('/bird/' + req.body._id);
      }
      else {
        next(err);
      }
    });
});

module.exports = router;
