var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'aysen',
  password : 'octocat',
  database : 'azchat'
});
 
connection.connect();

app.listen(8000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.on('first connection', function () {
    connection.query('SELECT * FROM msg ORDER BY id ASC LIMIT 100', function(err, rows, fields) {
      if (err) throw err;
      var msgs = [];
      for (var i = 0; i < rows.length; i++) {
        msgs.push({
          author: rows[i].msg_author,
          msg: rows[i].msg_text
        });
      }
      console.log('logged in');
      socket.emit('all msgs', msgs);
    });
  });
  socket.on('send msg', function(msg) {
    msg = JSON.parse(msg);
    if (msg.author.length < 40 && msg.msg.length < 250) {
      console.log('send msg', msg);
      connection.query('INSERT INTO msg (id, msg_author, msg_text) VALUES (NULL, "' + msg.author + '", "' + msg.msg + '")', function(err, rows, fields) {
        if (err) throw err;
        io.emit('new msg', msg);
      });
    }
  });
});