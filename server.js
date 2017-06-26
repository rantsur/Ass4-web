var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var DButilsAzure = require('../ass4/DBUtils');
var moment = require('moment');
var users = require('./routes/users');
var products = require('./routes/products');
var admins = require('./routes/admins');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);
app.use('/products', products);
app.use('/admins', admins);

var port = 5000;

app.listen(port, function () {
    console.log('listening to port: ' + port);
});
app.post('/register', function (req, res, next) {
    isUserNameExist(req).then(function (ans) {
        if (ans.length > 0)
            throw  new Error("User Name is already exist!")
    }).then(function () {
        return insertNewClient(req);
    }).then(function () {
        return insertPreferences(req);
    }).then(function () {
        return insertQuestion(req);
    }).then(function () {
        var cookieInfo = new Object();
        cookieInfo.UserName = req.body.UserName;
        cookieInfo.LastVisited = new Date();
        res.cookie('shop', cookieInfo).send("client added successfully!");
    })
        .catch(function (err) {
            next(err);
        });
});
app.post('/login', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Clients WHERE UserName=\'' + req.body.UserName + '\' AND Password=\'' + req.body.Password + '\'')
        .then(function (ans) {
            if (ans.length > 0) {
                var cookieInfo = new Object();
                cookieInfo.UserName = req.body.UserName;
                cookieInfo.LastVisited = new Date();
                res.cookie('shop', cookieInfo).send("logged in successfully!");
            }
            else {
                throw new Error("UserName/Password incorrect");
            }
        })
        .catch(function (err) {
            next(err);
        });
});
app.get('/getQuestions', function (req, res, next) {

    DButilsAzure.Select('SELECT * FROM Questions')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
app.get('/getUsersQuestions/:UserName', function (req, res, next) {
    var userName = req.params.UserName;
    DButilsAzure.Select('SELECT QuestionID FROM QuestionsForUser where UserName=\'' + userName + '\'')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
app.post('/restorePasword', function (req, res, next) {
    var qIDs = req.body.QuestionID;
    var answers = req.body.Answers;
    var userName = req.body.UserName;
    var check = true;
    DButilsAzure.Select('select * from QuestionsForUser where ' +
        'UserName=\'' + userName + '\' ' +
        'and ((QuestionID=\'' + qIDs[0] + '\' and Answer=\'' + answers[0] + '\') or (QuestionID=\'' + qIDs[1] + '\' and Answer=\'' + answers[1] + '\'))')
        .then(function (ans) {
            if (ans.length == 2) {
                DButilsAzure.Select('select Password from Clients where UserName=\'' + req.cookies.shop.UserName + '\'')
                    .then((ans) => res.send(ans))
                    .catch(function (err) {
                        next(err);
                    });
            }
            else
                next(new Error("invalid answers"));
        })
        .catch(function (err) {
            next(err);
        });
});
app.get('/getCategories', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Categories ')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
app.get('/getBrands', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Brands ')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
app.get('/getTopXItems/:Quantity/:days', function (req, res, next) {
    var fiveDaysAgo = moment().subtract(req.params.days, 'day').format("YYYY-MM-DD");
    let orderID = 'SELECT OrderID FROM Orders WHERE OrderDate>=\'' + fiveDaysAgo + '\'';
    let productID = 'SELECT TOP ' + req.params.Quantity + ' ProductID ' +
        'FROM ProductsInOrder WHERE OrderID IN (' + orderID + ') GROUP BY ProductID ORDER BY SUM(Amount) DESC';
    let products = 'SELECT * FROM Products WHERE ProductID IN (' + productID + ')';

    DButilsAzure.Select(products).then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
app.get('/getProducts', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Products')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});

app.get('/getProductsNew', function (req, res, next) {
    DButilsAzure.Select('SELECT P.ProductID,P.Description,P.Price,P.DateAdded,P.imagePath,B.BrandName,C.CategoryName FROM Products P INNER JOIN Categories C ON P.CategoryID=C.CategoryID INNER JOIN Brands B ON P.BrandID=B.BrandID')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});

function isUserNameExist(req) {
    var userName = req.body.UserName;
    var query = "select * from Clients where UserName='" + userName + "'";
    return DButilsAzure.Select(query);
}
function insertPreferences(req) {
    var userName = req.body.UserName;
    var categories = req.body.categories;
    var query = "INSERT INTO PrefencesForUser VALUES ";
    for (var i = 0; i < categories.length; i++)
        query = query + "('" + userName + "'," + categories[i] + "),";
    query = query.substring(0, query.length - 1);
    return DButilsAzure.Insert(query);
}
function insertQuestion(req) {
    var UserName = req.body.UserName;
    var QuestionID = req.body.questions;
    var Answer = req.body.answers;
    var query = "INSERT INTO QuestionsForUser VALUES "
    for (var i = 0; i < QuestionID.length; i++)
        query = query + "('" + UserName + "'," + QuestionID[i] + ",'" + Answer[i] + "'),";
    query = query.substring(0, query.length - 1);
    return DButilsAzure.Insert(query);
}
function insertNewClient(req) {
    var UserName = req.body.UserName;
    var Password = req.body.Password;
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Address = req.body.Address;
    var City = req.body.City;
    var Country = req.body.Country;
    var Phone = req.body.Phone;
    var Cellular = req.body.Cellular;
    var Mail = req.body.Mail;
    var CreditCardNumber = req.body.CreditCardNumber;
    var isAdmin = req.body.isAdmin;
    let query = "INSERT INTO Clients (UserName,Password,FirstName,LastName,Address,City,Country,Phone,Cellular,Mail,CreditCardNumber,isAdmin) VALUES ('" + UserName + "','" + Password + "','" + FirstName + "','" + LastName + "','" + Address + "','" + City + "','" + Country + "','" + Phone + "','" + Cellular + "','" + Mail + "','" + CreditCardNumber + "','" + isAdmin + "')";
    return DButilsAzure.Insert(query);
}

app.use(function (err, req, res, next) {
    res.send(err.message);
});
module.exports = app;
