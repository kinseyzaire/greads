var express = require('express');
var knex = require('../db/knex.js');
var validate = require('../lib/validations');

var router = express.Router();

function Books() {
   return knex('books');
}

function Authors() {
   return knex('authors');
}

// AUTHORS index
router.get('/authors', function(req, res, next) {
  Authors().select().then(function(aresults){
    Books().select().then(function(bresults){
      res.render('authors/index', {authors: aresults, books: bresults});
    });
  });
});

// new AUTHOR

router.get('/authors/new', function(req, res, next) {
  res.render('authors/new');
});

// add new AUTHOR to db

router.post('/authors', function(req, res, next) {
  var error = validate.areUblank(req.body.firstname);
  if(!validate.areUblank(req.body.firstname)) {
    Authors().insert(req.body).then(function(result){
      res.redirect('/authors');
    });
  } else {
      res.render('authors/new', {error: error})
  }
});

// show AUTHOR

router.get('/authors/:id', function (req, res, next) {
  Authors().where('id', req.params.id).first().then(function(result){
    // need to grab all author_id_* how?
    Books().where('author_id_1', req.params.id).orWhere('author_id_2', req.params.id).orWhere('author_id_3', req.params.id).then(function(results){
      res.render('authors/show', { author: result, books: results });
    });
  });
});

// edit AUTHOR form

router.get('/authors/:id/edit', function (req, res) {
  Authors().where('id', req.params.id).first().then(function(result){
    res.render('authors/edit', { author: result });
  });
});

// update AUTHOR in db

router.post('/authors/:id', function (req, res) {
  var error = validate.areUblank(req.body.firstname);
  if(!validate.areUblank(req.body.firstname)) {
    Authors().where('id', req.params.id).update(req.body).then(function(){
      res.redirect('/authors');
    });
  } else {
    Authors().where('id', req.params.id).first().then(function(result){
      res.render('authors/edit', { author: result, error: error });
    });
  }
});

// delete a AUTHOR

router.get('/authors/:id/delete', function (req, res) {
  Authors().where('id', req.params.id).del().then(function (result) {
    res.redirect('/authors');
  });
});


module.exports = router;
