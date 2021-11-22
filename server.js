var express = require('express');
var mysql = require('./db-connector')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

handlebars.handlebars.registerHelper('dateFormat', function (value) {
    return value.toLocaleDateString();
});

handlebars.handlebars.registerHelper('yesNo', function (value) {
    if (value === 1) {
        return "Yes";
    } else {
        return "No";
    }
});


handlebars.handlebars.registerHelper('ifNull', function (value) {
    if (value == null) {
        return "None";
    } else {
        return value;
    }
});

app.set('port', 1470);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    mysql.pool.query('SELECT bank_id, name, city, street, zip, phone FROM Blood_banks', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.banks = results;
        res.render('bank', context);
    });
});

/* Adds a blood bank, redirects to the blood banks page after adding */

app.post('/blood-banks',function(req,res,next){
    var sql = "INSERT INTO Blood_banks (`name`,`city`,`street`,`zip`,`phone`) VALUES (?,?,?,?,?)";
    var inserts = [req.body.name,req.body.city,req.body.street,req.body.zip,req.body.phone];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/blood-banks');
    });
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
    mysql.pool.query('SELECT bank_id, name FROM Blood_banks', function(err, bank_results, fields){
        if(err){
            next(err);
            return;
        }
        context.banks = bank_results;
    });
    mysql.pool.query('SELECT Blood_drives.drive_id, Blood_drives.drive_date, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors INNER JOIN Blood_drive_donors ON Donors.donor_id=Blood_drive_donors.donor_id INNER JOIN Blood_drives ON Blood_drive_donors.drive_id = Blood_drives.drive_id', function(err, blood_drive_donor_results, fields){
        if(err){
            next(err);
            return;
        }
        context.blood_drive_donors = blood_drive_donor_results;
    });
    mysql.pool.query('SELECT drive_id, Blood_banks.name, drive_date, amt_collected, Blood_drives.city, Blood_drives.zip FROM Blood_drives INNER JOIN Blood_banks ON Blood_drives.bank_id = Blood_banks.bank_id', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.drives = results;
        res.render('drive', context);
    });
});

app.post('/blood-drives',function(req,res,next){
    var sql = "INSERT INTO Blood_drives (`bank_id`,`drive_date`,`amt_collected`,`city`,`zip`) VALUES (?,?,?,?,?)";
    var inserts = [req.body.bank_id,req.body.drive_date,req.body.amt_collected,req.body.city,req.body.zip];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/blood-drives');
    });
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
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="O-"', function(err, o_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.o_neg = o_neg;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="O+"', function(err, o_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.o_pos = o_pos;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="A-"', function(err, a_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.a_neg = a_neg;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="A+"', function(err, a_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.a_pos = a_pos;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="B-"', function(err, b_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.b_neg = b_neg;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="B+"', function(err, b_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.b_pos = b_pos;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="AB-"', function(err, ab_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.ab_neg = ab_neg;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="AB+"', function(err, ab_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.ab_pos = ab_pos;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.donors = results;
        res.render('donor', context);
    });
});

/* Adds a donor, redirects to the donor page after adding */

app.post('/donors',function(req,res,next){
    var sql = "INSERT INTO Donors (`first_name`,`last_name`,`phone`,`email`,`donor_DOB`, `blood_type`, `times_donated`) VALUES (?,?,?,?,?,?,?)";
    var inserts = [req.body.first_name,req.body.last_name,req.body.phone,req.body.email,req.body.donor_DOB,req.body.blood_type,req.body.times_donated];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/donors');
    });
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
    mysql.pool.query('SELECT bank_id, name FROM Blood_banks', function(err, bank_results, fields){
        if(err){
            next(err);
            return;
        }
        context.banks = bank_results;
    });
    mysql.pool.query('SELECT donor_id, first_name, last_name, blood_type FROM Donors', function(err, donor_results, fields){
        if(err){
            next(err);
            return;
        }
        context.donors = donor_results;
    });
    mysql.pool.query('SELECT request_id, request_type, request_date FROM Requests', function(err, request_results, fields){
        if(err){
            next(err);
            return;
        }
        context.requests = request_results;
    });
    mysql.pool.query('SELECT donation_id, Blood_banks.name, Donors.first_name, Donors.last_name, Donors.blood_type, Requests.request_id, amt_donated, date_collected FROM Donations INNER JOIN Blood_banks ON Donations.bank_id = Blood_banks.bank_id INNER JOIN Donors ON Donations.donor_id = Donors.donor_id LEFT JOIN Requests ON Donations.request_id = Requests.request_id', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.donations = results;
        res.render('donation', context);
    });
});

app.post('/donations',function(req,res,next){
    var sql = "INSERT INTO Donations (`bank_id`,`donor_id`,`request_id`,`amt_donated`,`date_collected`) VALUES (?,?,?,?,?)";
    var inserts = [req.body.bank_id,req.body.donor_id,req.body.request_id,req.body.amt_donated,req.body.date_collected];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/donations');
    });
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
    mysql.pool.query('SELECT hospital_id, name FROM Hospitals', function(err, hospital_results, fields){
        if(err){
            next(err);
            return;
        }
        context.hospitals = hospital_results;
    });
    mysql.pool.query('SELECT request_id, request_amt, request_type, request_date, request_filled, Hospitals.name FROM Requests INNER JOIN Hospitals ON Requests.hospital_id = Hospitals.hospital_id', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.requests = results;
        res.render('request', context);
    });
});

/* Adds a request, redirects to the requests page after adding */

app.post('/requests',function(req,res,next){
    var sql = "INSERT INTO Requests (`hospital_id`,`request_amt`,`request_type`,`request_date`,`request_filled`) VALUES (?,?,?,?,?)";
    var inserts = [req.body.hospital_id,req.body.request_amt,req.body.request_type,req.body.request_date,req.body.request_filled];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/requests');
    });
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
    mysql.pool.query('SELECT hospital_id, name, city, zip, phone FROM Hospitals', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.hospitals = results;
        res.render('hospital', context);
    });
});

/* Adds a hospital, redirects to the hospital page after adding */

app.post('/hospitals',function(req,res,next){
    var sql = "INSERT INTO Hospitals (`name`,`city`,`zip`,`phone`) VALUES (?,?,?,?)";
    var inserts = [req.body.name,req.body.city,req.body.zip,req.body.phone];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/hospitals');
    });
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