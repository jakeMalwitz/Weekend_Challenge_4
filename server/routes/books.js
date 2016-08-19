var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {
  // Retrieve books from database
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function (err, result) {
      done(); // closes connection, I only have 10!
      if (err) {
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var book = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO books (author, title, published, genre) '
                + 'VALUES ($1, $2, $3, $4)',
                [book.author, book.title, book.published, book.genre],
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(201);
                  }
                });
  });
});

router.put('/:id', function(req, res){
  var id = req.params.id;
  var book = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if (err){
      res.sendStatus(500);
    }

    client.query('UPDATE books ' +
  'SET author = $1, ' +
  'title = $2, ' +
  'published = $3, ' +
  'genre = $4 ' +
  'WHERE id = $5',
[book.author, book.title, book.published, book.genre, id],
function(err, result){
  done();

  if(err){
    console.log("Hey 1", err);
    res.sendStatus(500);
    console.log(err)
  } else {
    res.sendStatus(200);
  }
   });
  });
});

router.delete('/:id', function(req, res){
  var id = req.params.id;
  console.log('Deleted', id);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      res.sendStatus(500);
    }

    client.query('DELETE FROM books ' +
                 'WHERE id= $1',
                 [id],
                 function(err, result){
                   done();
                   if(err){
                     res.sendStatus(500);
                     return;
                   }
                   res.sendStatus(200);
                 }
  )
  })
})

module.exports = router;
