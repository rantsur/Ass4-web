var express = require('express');
var router = express.Router();
var DButilsAzure = require('../../ass4/DBUtils');
var moment = require('moment');


router.use('/', function (req, res, next) {
    if (checkCookie(req))
        next();
    else
        next(new Error("you must log in first!"));
})
router.get('/checkQuantity/:ProductID', function (req, res, next) {
    DButilsAzure.Select('SELECT Quantity FROM Stock Where ProductID=\'' + req.params.ProductID + '\'')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
router.get('/SearchForProducts/:toSearch', function (req, res, next) {
    var str = req.params.toSearch;
    let brandID = 'SELECT BrandID FROM Brands WHERE BrandName LIKE \'%' + str + '%\'';
    let categoryID = 'SELECT CategoryID FROM Categories WHERE CategoryName LIKE \'%' + str + '%\'';
    let productID = 'SELECT ProductID FROM Products WHERE Description LIKE \'%' + str + '%\'';
    let products = 'SELECT * FROM Products WHERE ProductID IN (' + productID + ') OR BrandID IN (' + brandID + ') OR CategoryID IN (' + categoryID + ')';

    DButilsAzure.Select(products)
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
router.get('/checkStock/:ProductID/:Quantity', function (req, res, next) {
    DButilsAzure.Select('SELECT ProductID FROM Stock Where ProductID=\'' + req.params.ProductID + '\' AND Quantity>=\'' + req.params.Quantity + '\' ')
        .then(function (ans) {
            if (ans.length > 0)
                res.send("True");
            else
                res.send("False");
        })
        .catch(function (err) {
            next(err);
        });
});
router.get('/getNewestXItems/:Quantity/:days', function (req, res, next) {
    var dateMonthAgo = moment().subtract(req.params.days, 'day').format("YYYY-MM-DD");
    DButilsAzure.Select('SELECT TOP ' + req.params.Quantity + ' * FROM Products WHERE DateAdded>=\'' + dateMonthAgo + '\' ORDER BY DateAdded DESC')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
router.get('/getNewestXItems/:days', function (req, res, next) {
    var dateMonthAgo = moment().subtract(req.params.days, 'day').format("YYYY-MM-DD");
    DButilsAzure.Select('SELECT * FROM Products WHERE DateAdded>=\'' + dateMonthAgo + '\' ORDER BY DateAdded DESC')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
function checkCookie(req) {
    if (req.cookies != null && req.cookies.shop) {
        return true;
    }
    else false;
}

module.exports = router;