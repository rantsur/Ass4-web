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
//----------------------------------------------------------------
app.controller('productsCtrl', ['$http','localStorageService','$window', function($http,localStorageService, $window) {
    var self = this;
    self.Products = [];
    self.productsToShow=[];
    self.Categories = [];
    self.show=true;
    self.brands=[];

    self.url = url+"getProducts";
    $http.get(self.url).then(function(response) {
        self.Products = response.data;
    }, function(errResponse) {
        console.error('Error while fetching notes');
    }).then(function () {
        self.url = url+"getCategories";
        $http.get(self.url).then(function(response) {
            self.Categories = response.data;
            for (let i=0;i<self.Products.length;i++)
            {
                self.Products[i].categoryName=self.Categories[ self.Products[i].CategoryID-1].CategoryName;
            }
        }, function(errResponse) {
            console.error('Error while fetching notes');
        }).then(function () {
            self.url = url+"getBrands";
            $http.get(self.url).then(function(response) {
                self.brands = response.data;
                for (let i=0;i<self.Products.length;i++)
                {
                    self.Products[i].brandName=self.brands[ self.Products[i].BrandID-1].BrandName;
                }
                for (let i=0;i<self.Products.length;i++)
                {
                    self.productsToShow[i]=self.Products[i];
                }
                self.show=false;
            }, function(errResponse) {
                console.error('Error while fetching notes');
            })
        })
    })
    self.addProductToCart=function (Products) {
        let pToInsert= new Object();
        pToInsert.ID=Products.ProductID;
        pToInsert.description=Products.Description;
        pToInsert.price=Products.Price;
        pToInsert.imagePath=Products.imagePath;
        pToInsert.categoryName=Products.categoryName;
        pToInsert.amount=1;
        pToInsert.brandName=Products.brandName;

        let valueStored = localStorageService.get(Products.ProductID);
        if (!valueStored) {
            if (localStorageService.set(Products.ProductID, pToInsert))
                $window.alert('item was added successfully to the cart');
            else
                $window.alert('failed to add the item please try again later');
        }
        else
            $window.alert('the item is already in your cart');
    }

    self.getProducts=function () {
        self.productsToShow=self.Products;

    }

    self.getUnderwear=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryID == 5) {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getSkirts=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryID == 4) {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getTrousers=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryID == 2) {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getShirts=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryID == 1) {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getDresses=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryID == 3) {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
}]);
//-------------------------------------------------------------------------------------------------------------------
app.controller('cartCtrl', ['$http','localStorageService','$window', function($http,localStorageService) {
    var self = this;
    self.getProductsFromStorage=function () {
        let ProductsFromStorage = [];
        let keys=localStorageService.keys();
        for(let i=0;i<keys.length;i++)
        {
            ProductsFromStorage[i]=localStorageService.get(keys[i]);
        }
        return ProductsFromStorage;
    };

    self.Products=self.getProductsFromStorage();
    self.increaseAmount=function (Product) {
        Product.amount= Product.amount+1;
        localStorageService.set(Product.ID, Product)
    };
    self.decreaseAmount=function (Product) {
        if( Product.amount!=0) {
            Product.amount = Product.amount - 1;
            localStorageService.set(Product.ID, Product)
        }
    };
    self.DeleteItem=function (Product) {
        localStorageService.remove(Product.ID);
        self.Products=self.getProductsFromStorage();
    };
    self.ClearAll=function () {
        localStorageService.clearAll();
        self.Products=self.getProductsFromStorage();
    }
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
    self.registerClick = function() {
        // var i;
        // var selec = [];
        // for (i = 0; i < self.Categories.length; i++) {
        //     if(self.Categories[self.Categories[i]].checked == true)
        //        selec.push(self.Categories[i]);
        // }
        var Indata =
            {'UserName': self.userName,
                'Password': self.password,
                'FirstName': self.fname,
                'LastName': self.lname,
                'Address': self.Address,
                'City': self.City,
                'Country': self.Country,
                'Phone': self.Phone,
                'Cellular': self.Cellular,
                'Mail': self.mail,
                'CreditCardNumber': self.ccn,
                'isAdmin':'0',
                'answers':[self.ans1, self.ans2],
                'questions':[self.selectedQuestion.QuestionID,self.selectedQuestion2.QuestionID],
                'Categories': self.selec
            };
        self.url= url +"register";
        $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
            self.message = response.data;
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });
    };
}]);

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
            templateUrl: "views/home.html",
            controller: "mainController"
        })
        .when("/products", {
            templateUrl: "views/products.html",
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
        .when("/cart", {
            templateUrl : "views/cart.html",
            controller: 'cartCtrl'
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
