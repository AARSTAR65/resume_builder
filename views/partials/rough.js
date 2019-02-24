<%if (sess.loggedIn) { %>
                    <% include ../partials/header-li %>
                <% } else { %>
                    <% include ../partials/header-lo %>
                <% } %>










                    <%if (err==1) { %>
                    <% include ../partials/loginerr-c %>
                    <% } %>








 app.post('/login', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
       if (err) throw err;
       var dbo = db.db("rbudb");
       var query = { email: req.body.email };
       console.log(req.body.email);
       dbo.collection("users").find(query).toArray(function (err, result) {
          if (err) throw err;
          if (result.length == 0) {
             res.render('public/login');
          }
          else {
             bcrypt.compare(req.body.password, result[0].password, function (err, matched) {
                if (err) throw err;
                if (matched) {
                   res.send("Login ho gya re!!!");
                }
                else {
                   res.render('public/login');
                }
             });
          }
          db.close();
       });
    });
 });








<ul class="nav navbar-nav navbar-right">
            <li><a href="signup.html"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
            <li><a href="login.html"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
        </ul>





        align="left"







        <%if (LoggedIn) { %>
        <% include ../partials/header-li %>
        <% } else { %>
        <% include ../partials/header-lo %>
        <% } %>











        <%if (LoggedIn) { %>
            <% include ../partials/header-li %>
            <% } %>


















            http.createServer(function (request, response) {
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end('Hello World\n');
}).listen(8081);
console.log('Server running at http://127.0.0.1:8081/');