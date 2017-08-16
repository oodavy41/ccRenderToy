var express = require('express');
var app = express();
var port = process.env.PORT || 2333;

app.use(express.static(__dirname + '/public'));

app.use(function (req, res) {
    res.sendfile('./static/index.html')
});


app.listen(port, function () {
    console.log('server is on port' + port + '!')
});