var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/:genre', function (req, res) {
  // Retrieve books from database
  var genre = req.params.genre;
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books ' +
                 'WHERE genre = $1',
                  [genre],
      function (err, result) {
      done();
      if (err) {
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});

module.exports = router;
