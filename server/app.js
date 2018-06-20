/*
* TODO:
*
*   - Add analytics
*   - Generate logs (use analytics instead?)
*
*/
var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    mongoose         = require('mongoose'),    
    PropertiesReader = require('properties-reader'),
    properties       = PropertiesReader('./server/config/festes.ini'),
    uri              = properties.get('database.url.festes');

// Connection to DB
mongoose.connect(uri, function(err, res) {
  if(err) {
    throw err;   
  }
  console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var models     = require('./models/festa')(app, mongoose);
var FestesCtrl = require('./controllers/festes');

var router = express.Router();
router.get('/', function(req, res) {
  res.status(200).send("It's working!");
});
app.use(router);

// API routes
var festes = express.Router();

properties.get('methods.festes.findAllFestes') ?  festes.route('/festes').get(FestesCtrl.findAll): null;
properties.get('methods.festes.addFesta') ?  festes.route('/festes').post(FestesCtrl.add): null;
properties.get('methods.festes.findById') ?  festes.route('/festes/:id').get(FestesCtrl.findById): null;
properties.get('methods.festes.updateFesta') ?  festes.route('/festes/:id').put(FestesCtrl.update): null;
properties.get('methods.festes.deleteFesta') ?  festes.route('/festes/:id').delete(FestesCtrl.delete): null;

app.use('/api', festes);

// Start server
var port = properties.get('server.port')
app.listen(port, function() {
  console.log("Node server running on http://localhost:" + port);
});

// Crawler testing
console.log('begin...');
var festesCrawler = require('./sites/festes.org');
festesCrawler.craw();
console.log('...end');
