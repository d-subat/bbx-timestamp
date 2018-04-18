
'use strict';

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://bbx-timestamp.glitch.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

 
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })




//#### timestamp api
app.route('/:timestamp')
    .get(function (request, response) {

     const requestts = request.params.timestamp;
     const dateObj = {
        "unix": null,
        "natural": null
     }
  
    function natural(time) {
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      return months[time.getMonth()] + " " + time.getUTCDate() + "," + time.getUTCFullYear();
    }
    if(isNaN(requestts)){
      dateObj.unix= parseInt(Date.parse(requestts)/1000).toFixed(0);
      dateObj.natural = requestts;
    }
    else if(!isNaN(requestts)){ 
      const time = new Date(requestts * 1000);
      dateObj.unix= requestts;
      dateObj.natural = natural(time);
    }
    response.send(dateObj)
});







// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});



// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

