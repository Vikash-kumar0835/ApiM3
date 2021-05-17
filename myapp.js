require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ShortUrl= require('./models/urlshortner');
const validUrl=require('valid-url');
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


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended:false}));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
/*
app.get('/api/shorturl',function(req,res){
const fulls= new ShortUrl().full;
const shorts= new ShortUrl().short;
res.json({original_url:fulls , short_url:shorts});


});
*/
//storing in db
app.post('/api/shorturl',function(req,res){
  let record=new ShortUrl();
  record.full=req.body.url;
  //record.short=req.body.short;
  // console.log(record,req.body,"vik");
  if(record.full==="" || record.full===null || record.full!=validUrl)
  {
     return res.send("Please enter valid url");
    
  }
  record.save(function(){

      res.json({full:record.full,short:record.short});
    
  });


});


app.get('/api/shorturl/:shorturls', async(req,res)=>{
  const shturl= await ShortUrl.findOne({short:req.params.shorturls});
//console.log(shturl,"vikash",req.params.shorturls);
  
  if(shturl===null) {
  return res.sendStatus(404)
  }
  shturl.clicks++;
  shturl.save();
   res.redirect(shturl.full);

});




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


/*
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
*/