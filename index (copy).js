var express = require('express');
var app = express();
var path = require("path");
var bcrypt = require('bcrypt');
var session = require('express-session');
var cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/rbudb";
const saltRounds = 10;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
   saveUninitialized: false,
   resave: true,
   rolling: true,
   secret: "I am Ironman..."
}))
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
   res.render('public/index', {
      LoggedIn: req.session.LoggedIn,
      user: req.session.user
   });
   console.log("Ae mubaarak ho Bro!!! \nChl pda!!! ");
});

app.get('/signup.html', function (req, res) {
   if (req.session.LoggedIn) {
      res.render('public/dashboard', {
         LoggedIn: req.session.LoggedIn,
         user: req.session.user
      });
      console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
   }
   else {
      res.render('public/signup', {
         LoggedIn: req.session.LoggedIn,
         user: req.session.user
      });
      console.log("Ae mubaarak ho Bro!!! \nYe b chl pda!!! ");
   }
});

app.get('/resumebuilder.html', function (req, res) {
   if (req.session.LoggedIn) {
      res.render('public/resume_builder', {
         LoggedIn: req.session.LoggedIn,
         user: req.session.user
      });
      console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
   }
   else {
      res.redirect('/login.html');
   }
});

app.get('/logout', function (req, res) {
   req.session.destroy();
   res.redirect('/login.html')
   console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
});

app.get('/resumetemplates.html', function (req, res) {
   if (req.session.LoggedIn) {
      res.render('public/resume_templates', {
         LoggedIn: req.session.LoggedIn,
         user: req.session.user
      });
      console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
   }
   else {
      res.redirect('/login.html');
   }
});

app.get('/login.html', function (req, res) {
   if (req.session.LoggedIn) {
      res.render('public/dashboard', {
         LoggedIn: req.session.LoggedIn,
         user: req.session.user
      });
      console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
   }
   else {

      res.render('public/login', {
         err: 0,
         LoggedIn: req.session.LoggedIn
      });
      console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
   }
});

app.get('/dashboard.html', function (req, res) {
   if (req.session.LoggedIn) {
      res.render('public/dashboard', {
         LoggedIn: req.session.LoggedIn,
         user: req.session.user
      });
      console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
   }
   else {
      res.redirect('/login.html');
   }
});

app.post('/signup', function (req, res) {
   MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("rbudb");
      bcrypt.genSalt(saltRounds, function (err, salt) {
         bcrypt.hash(req.body.password, salt, function (err, hash) {
            var myobj = { username: req.body.username, fName: req.body.fName, lName: req.body.lName, email: req.body.email, password: hash };
            dbo.collection("users").insertOne(myobj, function (err, res) {
               if (err) throw err;
               console.log("1 document inserted");
               db.close();
            });
         });
      });
   });
});

app.post('/search', function (req, res) {
   MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("rbudb");
      var query = { username: req.body.searchterm };
      dbo.collection("users").find(query).toArray(function (err, result) {
         if (err) throw err;
         res.render('public/search', {
            users: result,
            searchterm: req.body.searchterm,
            user: req.session.user,
            LoggedIn: req.session.LoggedIn
         });
         console.log(result);
         db.close();
      });
   });
});

app.post('/login', function (req, res) {
   MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("rbudb");
      var query = { email: req.body.email };
      console.log(req.body.email);
      dbo.collection("users").find(query).toArray(function (err, result) {
         if (err) throw err;
         if (result.length == 0) {
            res.render('public/login', {
               err: 1,
               LoggedIn: req.session.LoggedIn
            });
         }
         else {
            bcrypt.compare(req.body.password, result[0].password, function (err, matched) {
               if (err) throw err;
               if (matched) {
                  req.session.LoggedIn = true;
                  req.session.user = result[0];
                  if (req.body.remember) {

                  }
                  else {
                     req.session.cookie.maxage = 300000;
                  }
                  console.log(req.session.user);
                  res.redirect('/dashboard.html')
               }
               else {
                  res.render('public/login', {
                     err: 1,
                     LoggedIn: req.session.LoggedIn
                  });
               }
            });
         }
         db.close();
      });
   });
});

app.post('/generate', function (req, res) {
   res.render('resume_templates/template1', {
      user: req.body
   });
   console.log("Ae mubaarak ho Bro!!! \nYe waala b chl pda!!! ");
});

app.listen(3000, function (req, res) {
   console.log("Server chaalu ho gya re!!!")
});     