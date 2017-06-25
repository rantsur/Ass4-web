/**
 * Created by Hasidi on 18/06/2017.
 */
let url = "http://localhost:5500/";
let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule']);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------
app.controller('mainController', ['UserService', function (UserService) {
    let vm = this;
    vm.greeting = 'Have a nice day';
    vm.userService = UserService;
}]);
//-------------------------------------------------------------------------------------------------------------------
app.controller('loginController', ['UserService', '$location', '$window',
    function (UserService, $location, $window) {
        let self = this;
        self.user = {username: '', password: ''};

        self.login = function (valid) {
            if (valid) {
                UserService.login(self.user).then(function (success) {
                    $window.alert('You are logged in');
                    $location.path('/');
                }, function (error) {
                    self.errorMessage = error.data;
                    $window.alert('log-in has failed');
                })
            }
        };
    }]);
//-------------------------------------------------------------------------------------------------------------------
app.controller('citiesController', ['$http', 'CityModel', function ($http, CityModel) {
    let self = this;
    self.fieldToOrderBy = "name";
    // self.cities = [];
    self.getCities = function () {
        $http.get('/cities')
            .then(function (res) {
                // self.cities = res.data;
                //We build now cityModel for each city
                self.cities = [];
                angular.forEach(res.data, function (city) {
                    self.cities.push(new CityModel(city));
                });
            });
    };
    self.addCity = function () {
        let city = new CityModel(self.myCity);
        if (city) {
            city.add();
            self.getCities();
        }
    };
}]);
//----------------------------------------------------------------
app.controller('productsCtrl', ['$http', function ($http) {
    var self = this;
    self.Products = [];
    self.Categories = [];
    self.getProducts = function () {
        self.url = url + "getProducts";
        $http.get(self.url).then(function (response) {
            self.Products = response.data;
        }, function (errResponse) {
            console.error('Error while fetching notes');
        }).then(function () {
            self.url = url + "getCategories";
            $http.get(self.url).then(function (response) {
                self.Categories = response.data;
                for (let i = 0; i < self.Products.length; i++) {
                    self.Products[i].categoryName = self.Categories[self.Products[i].CategoryID - 1].CategoryName;
                }
            }, function (errResponse) {
                console.error('Error while fetching notes');
            })
        })
    };
}]);
//----------------------------------------------------------------

app.controller('registerCtrl', ['$http', function ($http) {
    var self = this;
    var Categories = [];
    var Questions = [];
    var Questions2 = [];
    self.init = function () {
        self.url = url + "getCategories";
        $http.get(self.url).then(function (response) {
            self.Categories = response.data;
            // return Promise.resolve();
        }, function (errResponse) {
            console.error('Error while Categories');
        })
            .then(function () {
                self.url = url + "getQuestions";
                $http.get(self.url).then(function (response) {
                    self.Questions = response.data;
                    self.Questions2 = self.Questions;
                }, function (errResponse) {
                    console.error('Error while Questions');
                });
            });
    };
}]);

// })
//
//     // self.registerClick = function() {
//     //     var Indata =
//     //         {'UserName': self.userName,
//     //             'Password': self.password,
//     //             'FirstName': self.fname,
//     //             'LastName': self.lname,
//     //             'Address': self.Address,
//     //             'City': self.City,
//     //             'Country': self.Country,
//     //             'Phone': self.Phone,
//     //             'Cellular': self.Cellular,
//     //             'Mail': self.mail,
//     //             'CreditCardNumber': self.ccn,
//     //             'isAdmin':'0'
//     //         };
//     //     self.url= url +"register";
//     //     $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
//     //         self.message = response.data;
//     //     }, function(errResponse) {
//     //         console.error('Error while fetching notes');
//     //     });
//     // };
// }]);
// self.Questions.push({"QuestionID":"0" , "Description":"Please choose first identify question"});
// self.Questions2.push({"QuestionID":"0" , "Description":"Please choose second identify question"});


//-------------------------------------------------------------------------------------------------------------------
app.factory('UserService', ['$http', function ($http) {
    let service = {};
    service.isLoggedIn = false;
    service.login = function (user) {
        return $http.post('/login', user)
            .then(function (response) {
                let token = response.data;
                $http.defaults.headers.common = {
                    'my-Token': token,
                    'user': user.username
                };
                service.isLoggedIn = true;
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);
//-------------------------------------------------------------------------------------------------------------------
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../../ass3/public/views/home.html",
            controller: "mainController"
        })
        .when("/products", {
            templateUrl: "../../ass3/public/views/products.html",
            controller: "productsCtrl"
        })
        .when("/register", {
            templateUrl: "views/register.html",
            controller: "registerCtrl"
        })
        .when("/login", {
            templateUrl: "../../ass3/public/views/login.html",
            controller: "loginController"
        })
        .when("/cities", {
            templateUrl: "../../ass3/public/views/cities.html",
            controller: 'citiesController'
        })
        .when("/StorageExample", {
            templateUrl: "../../ass3/public/views/StorageExample.html",
            controller: 'StorageExampleController'
        })
        .otherwise({
            redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
