var express = require('express');
var router = express.Router();
var DButilsAzure = require('../../ass4/DBUtils');

router.use('/', function (req, res, next) {
    if (checkCookie(req))
        next();
    else
        next(new Error("you must logged in first!"));
})
router.post('/purchaseShoppingCart', function (req, res, next) {
    insertToOrderTable(req).then(function () {
        return getLastOrderID();
    }).then(function (ans) {
        return insertToProdForOrderTable(req, ans[0])
    }).then(function () {
        return updateStockAfterPurchase(req);
    }).then(function () {
        res.send("order added successfully!");
    }).catch(function (err) {
        next(err);
    });
});
router.get('/getPastPurchases', function (req, res, next) {
    DButilsAzure.Select('SELECT * FROM Orders WHERE UserName=\'' + req.cookies.shop.UserName + '\'')
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
router.get('/getRecommendedProductsForUser', function (req, res, next) {
    let myOrdersID = 'Select OrderID from Orders Where UserName=\'' + req.cookies.shop.UserName + '\''
    let PurchasedProductsID = 'Select ProductID from ProductsInOrder Where OrderID IN (' + myOrdersID + ')';
    let myCategoryID = 'Select CategoryID from PrefencesForUser Where UserName= \'' + req.cookies.shop.UserName + '\'';
    let productsInCategory = 'Select ProductID from Products where CategoryID IN(' + myCategoryID + ')';
    let query = 'Select * from Products Where ProductID IN(' + productsInCategory + ')'+
            'AND ProductID NOT IN(' + PurchasedProductsID + ')';

    DButilsAzure.Select(query)
        .then((ans) => res.send(ans))
        .catch(function (err) {
            next(err);
        });
});
function getLastOrderID() {
    var query = "select max(OrderID) as OrderID from Orders";
    return DButilsAzure.Select(query);
}
function insertToOrderTable(req) {
    var UserName = req.body.UserName;
    var OrderDate = req.body.OrderDate;
    var ShipmentDate = req.body.ShipmentDate;
    var Currency = req.body.Currency;
    var TotalAmount = req.body.TotalAmount;
    var query = "INSERT INTO Orders VALUES ('" + UserName + "','" + OrderDate + "','" + ShipmentDate + "','" + Currency + "','" + TotalAmount + "')";
    return DButilsAzure.Insert(query);
}
function insertToProdForOrderTable(req, ans) {

    var productsId = req.body.Products;
    var amounts = req.body.Quantities;
    var query = "INSERT INTO ProductsInOrder VALUES ";
    for (var i = 0; i < productsId.length; i++)
        query = query + "(" + ans.OrderID + "," + productsId[i] + "," + amounts[i] + "),";
    query = query.substring(0, query.length - 1);
    return DButilsAzure.Insert(query);
}
function updateStockAfterPurchase(req) {
    var productID = req.body.Products;
    var quantity = req.body.Quantities;
    var query = "UPDATE Stock SET Quantity = CASE ProductID"
    for (var i = 0; i < productID.length; i++)
        query = query + " WHEN " + productID[i] + " THEN Stock.Quantity - " + quantity[i] + " ";
    query = query + " END WHERE ProductID IN ("
    for (var i = 0; i < productID.length; i++)
        query = query + productID[i] + ',';
    query = query.substring(0, query.length - 1);
    query = query + ")"
    return DButilsAzure.Insert(query);
}
function checkCookie(req) {
    if (req.cookies != null && req.cookies.shop) {
        return true;
    }
    else false;
}

module.exports = router;

// router.get('/getRecommendedProductsForUser',function (req,res,next) {
//     DButilsAzure.Select('SELECT Products.ProductID, Products.CategoryID, Products.Description ' +
//         'FROM Products INNER JOIN PrefencesForUser ON Products.CategoryID=PrefencesForUser.CategoryID ' +
//         'Where UserName=\''+req.cookies.shop.UserName+'\' ORDER BY CategoryID;')
//         .then((ans)=>res.send(ans))
//         .catch(function (err){
//             next(err);
//         });
// });