var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var DButilsAzure = require('../ass3/DBUtils');
var moment = require('moment');
var users = require('./routes/users');
var products = require('./routes/products');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);
var port = 5000;

app.listen(port, function () {
    console.log('listening to port: ' + port);
});
app.post('/register',function (req,res) {
    insertNewClient(req).then(function () {
        return insertPrefernces(req);
    }).then(function () {
        return insertQuestion(req);
    }).then(function () {
        var cookieInfo=new Object();
        cookieInfo.UserName=req.body.UserName;
        cookieInfo.LastVisited=new Date();
        res.cookie('shop',cookieInfo).send("Insert Complete");
    })
        .catch(function (err) {
            console.log(err);
        });
});
app.post('/login',function (req,res) {
    DButilsAzure.Select('SELECT * FROM Clients WHERE UserName=\''+req.body.UserName+'\' AND Password=\''+req.body.Password+'\'')
        .then(function (ans) {
            if(ans.length>0) {
                var cookieInfo = new Object();
                cookieInfo.UserName = req.body.UserName;
                cookieInfo.LastVisited = new Date();
                res.cookie('shop', cookieInfo).send();
            }
            else
            {
                res.send("UserName/Password incorrect");
            }
        })
        .catch((err)=>res.send(err));
});
app.get('/getCountries',function (req,res) {
    DButilsAzure.Select('SELECT CountryName FROM Countries')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});
app.get('/getQuestions',function (req,res) {

    DButilsAzure.Select('SELECT * FROM Questions')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});
app.get('/getUsersQuestions',function (req,res) {
    DButilsAzure.Select('SELECT QuestionID FROM QuestionsForUser where UserName=\''+req.cookies.shop.UserName+'\'')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});
app.post('/RestorePassword',function (req,res) {
//    var array = req.body.data;
    var qIDs=req.body.QuestionID;
    var answers=req.body.Answer;
    //var answers=req.params.Answer;
    var check=true;
    for(var i=0;i<answers.length;i++)
    {
        DButilsAzure.Select('select * from QuestionsForUser where ' +
            'UserName=\''+req.cookies.shop.UserName+'\' ' +
            'and QuestionID=\''+qIDs[i]+'\' and' + 'Answer=\''+answers[i]+'\'')
            .then(function (ans) {
                if(ans.length==0)
                    check=check&&false;
            })
            .catch((err)=>res.send(err));
    }
    if(check)
    {
        DButilsAzure.Select('select Password from Clients where UserName=\''+req.cookies.shop.UserName+'\'')
            .then((ans)=> res.send(ans))
            .catch((err)=>res.send(err));
    }
    else
        res.send("invalid answers")
});
app.get('/', function(req, res) {
    console.log("Cookies :  ", req.cookies);
});
app.get('/select', function (req,res) {
    //it is just a simple example without handling the answer
    DButilsAzure.Select('select * from Products')
        .then((ans)=> res.send(ans))
        .catch((err)=>res.send(err));
});
app.post('/insertOrder',function (req, res) {
    var UserName=req.body.UserName;
    var OrderDate=req.body.OrderDate;
    var ShipmentDate=req.body.ShipmentDate;
    var Currency=req.body.Currency;
    var TotalAmount=req.body.TotalAmount;
    var query="INSERT INTO Orders VALUES ('"+UserName+"','"+OrderDate+"','"+ShipmentDate+"','"+Currency+"','"+TotalAmount+"')";
    DButilsAzure.Insert(query).then(res.send( "success"))
        .catch((err)=>res.send(err));
});

//Ran
app.get('/getProducts',function (req,res) {
    DButilsAzure.Select('SELECT * FROM Products')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/getPastPurchases',function (req,res) {
    DButilsAzure.Select('SELECT * FROM Orders WHERE UserName=\''+req.cookies.shop.UserName+'\'')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/getNewestXItems/:Amount/:days',function (req,res) {
    var dateMonthAgo = moment().subtract(req.params.days,'day').format("YYYY-MM-DD");
    DButilsAzure.Select('SELECT TOP '+req.params.Amount+' * FROM Products WHERE DateAdded>=\''+dateMonthAgo+'\' ORDER BY DateAdded DESC')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/getTopXItems/:Quantity/',function (req,res) {
    var fiveDaysAgo = moment().subtract(5,'day').format("YYYY-MM-DD");
    let orderID='SELECT OrderID FROM Orders WHERE OrderDate>=\''+fiveDaysAgo+'\'';
    let productID='SELECT TOP '+req.params.Quantity+' ProductID ' +
        'FROM ProductsInOrder WHERE OrderID IN ('+orderID+') GROUP BY ProductID ORDER BY SUM(Amount) DESC';
    let products = 'SELECT * FROM Products WHERE ProductID IN ('+productID+')';

    DButilsAzure.Select(products).then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/getRecommendedProductsForUser',function (req,res) {
    DButilsAzure.Select('SELECT Products.ProductID, Products.CategoryID, Products.Description ' +
        'FROM Products INNER JOIN PrefencesForUser ON Products.CategoryID=PrefencesForUser.CategoryID ' +
        'Where UserName=\''+req.cookies.shop.UserName+'\' ORDER BY CategoryID;')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/checkQuantity/:ProductID',function (req,res) {
    DButilsAzure.Select('SELECT Quantity FROM Stock Where ProductID=\''+req.params.ProductID+'\'')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/SearchForProducts/:toSearch',function (req,res) {
    var str = req.params.toSearch;
    let brandID='SELECT BrandID FROM Brands WHERE BrandName LIKE \'%'+str+'%\'';
    let categoryID='SELECT CategoryID FROM Categories WHERE CategoryName LIKE \'%'+str+'%\'';
    let productID='SELECT ProductID FROM Products WHERE Description LIKE \'%'+str+'%\'';
    let products = 'SELECT * FROM Products WHERE ProductID IN ('+productID+') OR BrandID IN ('+brandID+') OR CategoryID IN ('+categoryID+')';

    DButilsAzure.Select(products)
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/checkStock/:ProductID/:Quantity',function (req,res) {
    DButilsAzure.Select('SELECT ProductID FROM Stock Where ProductID=\''+req.params.ProductID+'\' AND Quantity>=\''+req.params.Quantity+'\' ')
        .then(function(ans){
            if(ans.length>0)
                res.send("True");
            else
                res.send("False");
        })
        .catch((err)=>res.send(err));
});
//aa
function insertPrefernces(req){
    var userName = req.body.UserName;
    var categories = req.body.categories;
    var query="INSERT INTO PrefencesForUser VALUES ";
    for(var i=0; i<categories.length;i++)
        query=query+"('"+userName+"',"+categories[i]+"),";
    query=query.substring(0,query.length-1);
    return DButilsAzure.Insert(query);
}

function insertQuestion(req){
    var UserName=req.body.UserName;
    var QuestionID=req.body.questions;
    var Answer=req.body.answers;
    var query="INSERT INTO QuestionsForUser VALUES "
    for(var i=0;i<QuestionID.length;i++)
        query=query+"('"+UserName+"',"+ QuestionID[i]+",'"+ Answer[i]+"'),";
    query=query.substring(0,query.length-1);
    return DButilsAzure.Insert(query);
}
function insertNewClient(req) {
    var UserName=req.body.UserName;
    var Password=req.body.Password;
    var FirstName=req.body.FirstName;
    var LastName=req.body.LastName;
    var Address=req.body.Address;
    var City=req.body.City;
    var Country=req.body.Country;
    var Phone=req.body.Phone;
    var Cellular=req.body.Cellular;
    var Mail=req.body.Mail;
    var CreditCardNumber=req.body.CreditCardNumber;
    var isAdmin=req.body.isAdmin;
    let query="INSERT INTO Clients (UserName,Password,FirstName,LastName,Address,City,Country,Phone,Cellular,Mail,CreditCardNumber,isAdmin) VALUES ('"+UserName+"','"+Password+"','"+FirstName+"','"+LastName+"','"+Address+"','"+City+"','"+Country+"','"+Phone+"','"+Cellular+"','"+Mail+"','"+CreditCardNumber+"','"+isAdmin+"')";
    return DButilsAzure.Insert(query);
}

//module.exports = app;

//optional-----------------------------------------------------------------------------------------------------------------
app.get('/getOrders',function (req,res) {
    DButilsAzure.Select('SELECT * FROM Orders')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

app.get('/getStock',function (req,res) {
    DButilsAzure.Select('SELECT * FROM Stock')
        .then((ans)=>res.send(ans))
        .catch((err)=>res.send(err));
});

