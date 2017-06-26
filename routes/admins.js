/**
 * Created by Ran Tsur on 08/06/2017.
 */
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../../ass4/DBUtils');

router.use('/', function (req, res, next) {
    if (checkCookie(req)) {
        let query = "SELECT isAdmin FROM Clients WHERE UserName='" + req.cookies.shop.UserName + "'";
        DButilsAzure.Select(query).then(function (ans) {
            if (ans[0].isAdmin == 1)
                next();
            else
                next(new Error("you need admin permissions!"));
        })
    }
    else
        next(new Error("you must log in first!"));
})

router.get('/getOrders', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Orders')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
router.get('/getStock', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Stock')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
router.put('/deleteUser', function (req, res, next) {
    DButilsAzure.Insert('DELETE FROM Clients WHERE UserName=\'' + req.body.UserName + '\'')
        .then(function () {
            res.send("Delete user complete");
        })
        .catch(function (err) {
            next(err);
        });
});
router.post('/insertProduct', function (req, res, next) {
    var description = req.body.Description;
    var categoryID = req.body.CategoryID;
    var brandID = req.body.BrandID;
    var price = req.body.Price;
    var picture = req.body.Picture;
    var date = req.body.DateAdded;
    var query = "INSERT INTO Products VALUES ('" + description + "'," + categoryID + "," + brandID + "," + price + ",'" + date + "')";
    DButilsAzure.Insert(query).then(function () {
        res.send("Insert product Complete")
    }).catch(function (err) {
        next(err);
    });
});
router.put('/deleteProduct', function (req, res, next) {
    DButilsAzure.Insert('DELETE FROM Products WHERE ProductID=\'' + req.body.ProductID + '\'')
        .then(function () {
            res.send("Delete product complete");
        })
        .catch(function (err) {
            next(err);
        });
});
router.post('/insertUser', function (req, res, next) {
    insertNewClient(req).then(function () {
        return insertPrefernces(req);
    }).then(function () {
        return insertQuestion(req);
    }).then(function () {
        res.send("Insert User Complete");
    }).catch(function (err) {
        next(err);
    });
});
router.put('/updateStock', function (req, res, next) {
    updateStock(req).then(res.send("stock update successfully")).catch(function (err) {
        next(err);
    });
})

function updateStock(req) {
    var productID = req.body.Products;
    var quantity = req.body.Quantities;
    var query = "UPDATE Stock SET Quantity = CASE ProductID"
    for (var i = 0; i < productID.length; i++)
        query = query + " WHEN " + productID[i] + " THEN Stock.Quantity + " + quantity[i] + " ";
    query = query + " END WHERE ProductID IN ("
    for (var i = 0; i < productID.length; i++)
        query = query + productID[i] + ',';
    query = query.substring(0, query.length - 1);
    query = query + ")"
    return DButilsAzure.Insert(query);
}
function insertPrefernces(req) {
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

function checkCookie(req) {
    if (req.cookies != null && req.cookies.shop) {
        return true;
    }
    else false;
}

module.exports = router;