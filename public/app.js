let url = "http://localhost:5000/";
let app = angular.module('myApp', ['ngRoute','ngCookies','ngMessages','LocalStorageModule']);
let loogedIn=false;
//04/08/2017
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});


app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "components/home/home.html",
            controller: "mainController"
        })
        .when("/products", {
            templateUrl: "components/products/products.html",
            controller: "productsCtrl"
        })
        .when("/register", {
            templateUrl: "components/register/register.html",
            controller: "registerCtrl"
        })
        .when("/login", {
            templateUrl: "components/login/login.html",
            controller: "loginCtrl"
        })
        .when("/cart", {
            templateUrl : "components/cart/cart.html",
            controller: 'cartCtrl'
        })
        .when("/restore", {
            templateUrl : "components/restorePassword/restore.html",
            controller: 'restoreCtrl'
        })
        .when("/about", {
            templateUrl : "components/about/about.html",
            controller: 'aboutCtrl'
        })
        .otherwise({
            redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
