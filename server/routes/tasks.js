var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks', function (err, result) {
      done();
      if (err) {
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var task = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO tasks (task, status) '
                + 'VALUES ($1, $2)',
                [task.task, false],
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
  var task = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if (err){
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
  'SET status = $1 ' +
  'WHERE id = $2',
[true, id],
function(err, result){
  done();

  if(err){
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

    client.query('DELETE FROM tasks ' +
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
