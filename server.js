var express = require('express');
var mysql = require('./db-connector')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

handlebars.handlebars.registerHelper('dateFormat', function (value) {
    if (value !== null){
        return value.toLocaleDateString();
    }
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

handlebars.handlebars.registerHelper('isDefined', function (value) {
    return value !== undefined && value !== null;
});

app.set('port', 1470);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('public'))

// blood-banks query

function getBloodBanks(res, mysql, context, complete){
    mysql.pool.query('SELECT bank_id, name, city, street, zip, phone FROM Blood_banks', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.banks = results;
        complete();
    });
}

// donors queries

function getONeg(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="O-"', function(err, o_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.o_neg = o_neg;
        complete();
    });
}

function getOPos(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="O+"', function(err, o_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.o_pos = o_pos;
        complete();
    });
}

function getANeg(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="A-"', function(err, a_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.a_neg = a_neg;
        complete();
    });
}

function getAPos(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="A+"', function(err, a_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.a_pos = a_pos;
        complete();
    });
}

function getBNeg(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="B-"', function(err, b_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.b_neg = b_neg;
        complete();
    });
}

function getBPos(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="B+"', function(err, b_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.b_pos = b_pos;
        complete();
    });
}

function getABNeg(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="AB-"', function(err, ab_neg, fields){
        if(err){
            next(err);
            return;
        }
        context.ab_neg = ab_neg;
        complete();
    });
}

function getABPos(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE blood_type="AB+"', function(err, ab_pos, fields){
        if(err){
            next(err);
            return;
        }
        context.ab_pos = ab_pos;
        complete();
    });
}

function getDonors(res,mysql,context,complete){
    mysql.pool.query('SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.donors = results;
        complete();
    });
}

function getDonor(res,mysql,context,id,complete){
    var sql = 'SELECT donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors WHERE donor_id = ?';
    var inserts = [id];
    mysql.pool.query(sql,inserts,function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.donor = results[0];
        complete();
    });
}

// blood-drives queries

function getBloodDriveDonors(res,mysql,context,complete){
    mysql.pool.query('SELECT Blood_drives.drive_id, Blood_drives.drive_date, Donors.donor_id, first_name, last_name, phone, email, donor_DOB, blood_type, times_donated FROM Donors INNER JOIN Blood_drive_donors ON Donors.donor_id=Blood_drive_donors.donor_id RIGHT JOIN Blood_drives ON Blood_drive_donors.drive_id = Blood_drives.drive_id', function(err, blood_drive_donor_results, fields){
        if(err){
            next(err);
            return;
        }
        context.blood_drive_donors = blood_drive_donor_results;
        // make dropdown selector
        const select_arr = [];
        for (let i = 0; i < blood_drive_donor_results.length; i++) {
            const drive_donor = blood_drive_donor_results[i];
            const drive_id = drive_donor.drive_id;
            if (!(select_arr.includes(drive_id))){
                select_arr.push(drive_id);
            }
        }
        context.drive_selects = select_arr;
        // make Blood_drive_donors tables
        let drive_table = {};
        for (let i = 0; i < blood_drive_donor_results.length; i++) {
            const table_result = blood_drive_donor_results[i];
            if (!(table_result.drive_id in drive_table)){
                drive_table[table_result.drive_id] = [];
            }
            drive_table[table_result.drive_id].push(table_result);
        }
        context.drive_tables = drive_table;
        complete();
    });
}

function getBloodDrives(res,mysql,context,complete){
    mysql.pool.query('SELECT drive_id, Blood_banks.name, drive_date, amt_collected, Blood_drives.city, Blood_drives.zip FROM Blood_drives INNER JOIN Blood_banks ON Blood_drives.bank_id = Blood_banks.bank_id', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.drives = results;
        complete();
    });
}

// donations query

function getDonations(res,mysql,context,complete){
    mysql.pool.query('SELECT donation_id, Blood_banks.name, Donors.first_name, Donors.last_name, Donors.blood_type, Requests.request_id, amt_donated, date_collected FROM Donations INNER JOIN Blood_banks ON Donations.bank_id = Blood_banks.bank_id INNER JOIN Donors ON Donations.donor_id = Donors.donor_id LEFT JOIN Requests ON Donations.request_id = Requests.request_id', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.donations = results;
        complete();
    });
}

// requests query

function getRequests(res,mysql,context,complete){
    mysql.pool.query('SELECT request_id, request_amt, request_type, request_date, request_filled, Hospitals.name FROM Requests INNER JOIN Hospitals ON Requests.hospital_id = Hospitals.hospital_id', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.requests = results;
        complete();
    });
}

// hospitals query

function getHospitals(res,mysql,context,complete){
    mysql.pool.query('SELECT hospital_id, name, city, zip, phone FROM Hospitals', function(err, results, fields){
        if(err){
            next(err);
            return;
        }
        context.hospitals = results;
        complete();
    });
}

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
    var callbackCount = 0;
    context.isHome = false
    context.isBank = true
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    context.jsscripts = ["deleteBank.js"]
    getBloodBanks(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 1){
            res.render('bank', context);
        }
    }
});

// Adds a blood bank, redirects to the blood-banks page after adding

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

// deletes blood bank by id

app.delete('/blood-banks/:id',function(req,res,next){
    var sql = "DELETE FROM Blood_banks WHERE `bank_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

app.get('/blood-drives',function(req,res){
    var context = {};
    var callbackCount = 0;
    context.isHome = false
    context.isBank = false
    context.isDrive = true
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    context.jsscripts = ["deleteDrive.js", "deleteDriveDonor.js"]
    getBloodBanks(res, mysql, context, complete);
    getBloodDriveDonors(res, mysql, context, complete);
    getBloodDrives(res, mysql, context, complete);
    getDonors(res,mysql,context,complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 4){
            // make donor dropdown selector
            const all_donors = context.donors;
            const drive_tables = context.drive_tables;
            let final_select = {};
            for (let i in drive_tables) {
                const drive_donors_ids = drive_tables[i].map(donor => donor.donor_id);
                const donor_select = all_donors.map(a => {return Object.assign({}, a)});
                const filtered_select = donor_select.filter(drive_donor => !(drive_donors_ids.includes(drive_donor.donor_id)));
                final_select[i] = filtered_select
            }
            context.donor_selects = final_select;
            //console.log(context.donor_selects);
            res.render('drive', context);
        }
    }
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

// deletes blood drive by id

app.delete('/blood-drives/:id',function(req,res,next){
    var sql = "DELETE FROM Blood_drives WHERE `drive_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

app.post('/blood-drive-donors',function(req,res,next){
    var sql = "INSERT INTO Blood_drive_donors (`drive_id`,`donor_id`) VALUES (?,?)";
    var inserts = [req.body.drive_id,req.body.donor_id];
    mysql.pool.query(sql, inserts, function(err, results){
        if(err){
            next(err);
            return;
        }
        res.redirect('/blood-drives');
    });
});

// deletes blood drive donor by id

app.delete('/blood-drive-donors/:id',function(req,res,next){
    var sql = "DELETE FROM Blood_drive_donors WHERE `donor_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

app.get('/donors',function(req,res){
    var context = {};
    var callbackCount = 0;
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = true
    context.isDonation = false
    context.isRequest = false
    context.jsscripts = ["deleteDonor.js"]
    getONeg(res, mysql, context, complete);
    getOPos(res, mysql, context, complete);
    getANeg(res, mysql, context, complete);
    getAPos(res, mysql, context, complete);
    getBNeg(res, mysql, context, complete);
    getBPos(res, mysql, context, complete);
    getABNeg(res, mysql, context, complete);
    getABPos(res, mysql, context, complete);
    getDonors(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 9){
            res.render('donor', context);
        }
    }
});

app.delete('/donors/:id',function(req,res,next){
    var sql = "DELETE FROM Donors WHERE `donor_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

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

app.get('/donors/:id',function(req,res){
    var context = {};
    var callbackCount = 0;
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = true
    context.isDonation = false
    context.isRequest = false
    context.jsscripts = ["updateDonor.js"]
    getDonor(res, mysql, context, req.params.id, complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 1){
            res.render('update-donor', context);
        }
    }
});

app.put('/donors/:id',function(req,res,next){
    var sql = "UPDATE Donors SET `first_name`=?,`last_name`=?,`phone`=?,`email`=?,`donor_DOB`=?, `blood_type`=?, `times_donated`=? WHERE `donor_id`=?";
    if(req.body.phone === "null"){
        req.body.phone = null;
    }
    if(req.body.email === "null"){
        req.body.email = null;
    }
    var inserts = [req.body.first_name,req.body.last_name,req.body.phone,req.body.email,req.body.donor_DOB,req.body.blood_type,req.body.times_donated, req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

app.get('/donations',function(req,res){
    var context = {};
    var callbackCount = 0;
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = true
    context.isRequest = false
    context.jsscripts = ["deleteDonation.js"]
    getBloodBanks(res,mysql,context,complete);
    getDonors(res,mysql,context,complete);
    getRequests(res,mysql,context,complete);
    getDonations(res,mysql,context,complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 4){
            res.render('donation', context);
        }
    }
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

// deletes donation by id

app.delete('/donations/:id',function(req,res,next){
    var sql = "DELETE FROM Donations WHERE `donation_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

app.get('/requests',function(req,res){
    var context = {};
    var callbackCount = 0;
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = false
    context.isDonor = false
    context.isDonation = false
    context.isRequest = true
    context.jsscripts = ["deleteRequest.js"]
    getHospitals(res,mysql,context,complete);
    getRequests(res,mysql,context,complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 2){
            res.render('request', context);
        }
    }
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

// deletes request by id

app.delete('/requests/:id',function(req,res,next){
    var sql = "DELETE FROM Requests WHERE `request_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

app.get('/hospitals',function(req,res){
    var context = {};
    var callbackCount = 0;
    context.isHome = false
    context.isBank = false
    context.isDrive = false
    context.isHospital = true
    context.isDonor = false
    context.isDonation = false
    context.isRequest = false
    context.jsscripts = ["deleteHospital.js"]
    getHospitals(res,mysql,context,complete);
    function complete(){
        callbackCount++;
        if (callbackCount >= 1){
            res.render('hospital', context);
        }
    }
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

// deletes hospital from table

app.delete('/hospitals/:id',function(req,res,next){
    var sql = "DELETE FROM Hospitals WHERE `hospital_id` = ?"
    var inserts = [req.params.id];
    mysql.pool.query(sql, inserts, function(err, results, fields){
        if(err){
            next(err);
            return;
        }else{
            res.status(202).end();
        }
    });
})

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