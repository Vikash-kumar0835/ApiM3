require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
// Basic Configuration
const port = process.env.PORT || 3000;
//connection on mongodb
mongoose.connect('mongodb://localhost/shorturl');
let db=mongoose.connection;
//check connection
db.once('open',function(){
  console.log("connected to mongodb");
});
//check error
db.on('error',function(err){
  console.log(err);
});
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
