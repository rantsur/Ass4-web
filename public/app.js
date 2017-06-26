let url = "http://localhost:5000/";

let app = angular.module('myApp', ['ngRoute','ngCookies','LocalStorageModule']);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------
app.controller('mainController', ['$http','CookiesService', function ($http,CookiesService) {
    let self = this;
    self.productsToShow=[];
    self.temp=[];
    self.show=true;
    self.loggedIn=CookiesService.isCookie();
    self.newProducts=[];
    self.init = function () {
        self.url = url + "getTopXItems/5/7";
        $http.get(self.url).then(function (response) {
            self.temp = response.data;
        }, function (errResponse) {
            console.error('Error while fetching notes');
        }).then(function () {
            if (self.loggedIn){
                self.url = url + "products/getNewestXItems/30";
                $http.get(self.url).then(function (response) {
                    self.newProducts = response.data;
                    self.productsToShow=self.temp;
                    self.show = false;
                }, function (errResponse) {
                    console.error('Error while fetching notes');
                })
            }
            else{
                self.show = false;
                self.productsToShow=self.temp;
            }
        })
    }
}]);
//-------------------------------------------------------------------------------------------------------------------
app.controller('loginCtrl', ['$http', function ($http) {
    var self = this;
    self.message;
    self.login = function() {
        var Indata = {'UserName': self.UserName, 'Password': self.Password };
        self.url = url+ "login";
        $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
            self.message = response.data;
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });
    };
}]);

//-------------------------------------------------------------------------------------------------------------------
app.controller('restoreCtrl', ['$http', function ($http) {
    var self = this;
    self.message;
    self.init = function () {
        self.url = url + "getUsersQuestions/ran";
        $http.get(self.url).then(function (response) {
            self.Questions = response.data;
        }, function (errResponse) {
            console.error('Error while fetching notes');
        });
    };
    self.restore = function() {
        var Indata = {
            'UserName': self.UserName,
            'QuestionID':[self.questions1, self.questions2],
            'Answers':[self.ans1, self.ans2],
        };
        self.url = url+ "restore";
        $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
            self.message = response.data;
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });
    };
}]);
//----------------------------------------------------------------
app.controller('productsCtrl', ['$http','localStorageService','$window','CookiesService', function($http,localStorageService, $window,CookiesService) {
    var self = this;
    self.Products = [];
    self.productsToShow=[];
    self.Categories = [];
    self.show=true;
    self.brands=[];
    self.loggedIn=CookiesService.isCookie();

    self.init = function () {
        self.url = url + "getProductsNew";
        $http.get(self.url).then(function (response) {
            self.Products = response.data;
        }, function (errResponse) {
            console.error('Error while fetching notes');
        }).then(function () {
            if(self.loggedIn){
                self.url = url + "users/getRecommendedProductsForUser";
                $http.get(self.url).then(function (response) {
                    self.productsToRecomend = response.data;
                    for (let i = 0; i < self.Products.length; i++) {
                        self.productsToShow[i] = self.Products[i];
                    }
                    self.show = false;
                }, function (errResponse) {
                    console.error('Error while fetching notes');
                })
            }
            else
            {
                for (let i = 0; i < self.Products.length; i++) {
                    self.productsToShow[i] = self.Products[i];
                }
                self.show = false;
            }
        })

    };
    self.addProductToCart=function (Products) {
        let pToInsert= new Object();
        pToInsert.ID=Products.ProductID;
        pToInsert.description=Products.Description;
        pToInsert.price=Products.Price;
        pToInsert.imagePath=Products.imagePath;
        pToInsert.categoryName=Products.CategoryName;
        pToInsert.amount=1;
        pToInsert.brandName=Products.BrandName;

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
    self.showOrders=false;

    self.viewOldOrders=function () {
        self.orders=[];
        if(!self.showOrders) {
            self.url = url + "users/getPastPurchases";
            $http.get(self.url).then(function (response) {
                self.orders = response.data;
            }, function (errResponse) {
                console.error('Error while fetching notes');
            })
            self.showOrders=true;
        }
        else
            self.showOrders=false;
    }

    self.getProductsFromStorage=function () {
        let ProductsFromStorage = [];
        self.totalAmount=0;
        let keys=localStorageService.keys();
        for(let i=0;i<keys.length;i++)
        {
            ProductsFromStorage[i]=localStorageService.get(keys[i]);
            self.totalAmount=self.totalAmount+(ProductsFromStorage[i].price*ProductsFromStorage[i].amount);
        }
        return ProductsFromStorage;
    };

    self.Products=self.getProductsFromStorage();
    self.increaseAmount=function (Product) {
        Product.amount= Product.amount+1;
        localStorageService.set(Product.ID, Product)
        self.totalAmount=self.totalAmount+Product.price;

    };
    self.decreaseAmount=function (Product) {
        if( Product.amount!=0) {
            Product.amount = Product.amount - 1;
            localStorageService.set(Product.ID, Product)
            self.totalAmount=self.totalAmount-Product.price;
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
    self.closeClickModal=function () {
        self.modalProduct=false;
        self.modalOrder=false;
    }
    self.openModal=function (product) {
        self.modalProduct=true;
        self.modalPDescription=product.description;
        self.modalBrand=product.brandName;
        self.modalCategory=product.categoryName;
        self.modalPrice=product.price;
        self.modalImage=product.imagePath;
    }
    self.openModalOrder=function (order) {
        self.modalOrder=true;
        self.modalOrderNo=order.OrderID;
        self.modalOrderDate=order.OrderDate.substring(0,10);
        self.modalShipmentDate=order.ShipmentDate.substring(0,10);
        self.modalTotalAmount=order.TotalAmount;
    }
}]);
//----------------------------------------------------------------
app.controller('registerCtrl', ['$http', function ($http) {
    var self = this;
    var Categories = [];
    var Questions = [];
    var Questions2 = [];
    var Countries = [];
    self.init = function () {
        loadXMLDoc();
        self.url = url + "getCategories";
        $http.get(self.url).then(function (response) {
            self.Categories = response.data;
        }, function (errResponse) {
            console.error('Error while Categories');
        })
            .then(function () {
                self.url = url + "getQuestions";
                $http.get(self.url).then(function (response) {
                    self.Questions = response.data;
                    self.selectedQuestion = self.Questions[0];
                    self.Questions2 = self.Questions;
                    self.selectedQuestion2 = self.Questions2[1];
                }, function (errResponse) {
                    console.error('Error while Questions');
                });
            });
    };

    function loadXMLDoc() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                myFunction(this);
            }
        };
        xmlhttp.open("GET", "countries.xml", true);
        xmlhttp.send();
    }
    function myFunction(xml) {
        var i;
        var xmlDoc = xml.responseXML;
        var temp = [];
        var x = xmlDoc.getElementsByTagName("Country");
        for (i = 0; i <x.length; i++) {
            var json = { "ID" :x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue.toString(),
                "Name" :x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()}
            temp.push(json);
        }
        self.Countries = temp;
        self.selectedCountry = self.Countries[4];
    }

    self.registerClick = function() {
        var checkboxes = document.getElementsByName("myCheck");
        var checkboxesChecked = [];
        for (var i=0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checkboxesChecked.push(i+1);
            }
        }
        var Indata =
            {'UserName': self.userName,
                'Password': self.password,
                'FirstName': self.fname,
                'LastName': self.lname,
                'Address': self.Address,
                'City': self.City,
                'Country': self.selectedCountry.Name,
                'Phone': self.Phone,
                'Cellular': self.Cellular,
                'Mail': self.mail,
                'CreditCardNumber': self.ccn,
                'isAdmin':'0',
                'answers':[self.ans1, self.ans2],
                'questions':[self.selectedQuestion.QuestionID,self.selectedQuestion2.QuestionID],
                'categories': checkboxesChecked
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
//'ngCookies'
app.factory('CookiesService', ['$cookies', function ($cookies) {
    let service = {};
    service.getCookie =function () {
        return $cookies.get('shop');
    };
    service.isCookie =function () {
        // var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
        // if(pair!=null)
        //     return true;
        // return false;
        let cookie=$cookies.get('shop');
        if(cookie!=null)
            return true;
        return false;
    };
    return service;
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
            templateUrl: "views/login.html",
            controller: "loginCtrl"
        })
        .when("/cart", {
            templateUrl : "views/cart.html",
            controller: 'cartCtrl'
        })
        .when("/restore", {
            templateUrl : "views/restore.html",
            controller: 'restoreCtrl'
        })
        .otherwise({
            redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
