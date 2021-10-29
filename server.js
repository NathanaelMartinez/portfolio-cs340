var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 1470);

var bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(express.static('public'))

app.get('/',function(req,res){
    var context = {};
    context.isHome = true
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    res.render('home', context);
});

app.get('/blood-banks',function(req,res){
    var context = {};
    context.isHome = false
    context.isBank = true
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    res.render('bank', context);
});

app.get('/blood-drives',function(req,res){
    var context = {};
    context.isHome = false
    context.isBank = false
    context.isDrive = true
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    res.render('drive', context);
});

app.get('/donors',function(req,res){
    var context = {};
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = true
    context.isDonation = false
    context.isRequest = false
    res.render('donor', context);
});

app.get('/donations',function(req,res){
    var context = {};
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = true
    context.isRequest = false
    res.render('donation', context);
});

app.get('/requests',function(req,res){
    var context = {};
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = true
    res.render('request', context);
});

app.get('/hospitals',function(req,res){
    var context = {};
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = true
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    res.render('hospital', context);
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('App listening to port ' + app.get('port'));
});