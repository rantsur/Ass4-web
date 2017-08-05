/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('productsCtrl', ['$http','CookiesService','localStorageService','$window', function($http,CookiesService,localStorageService, $window) {
    var self = this;
    self.Products = [];
    self.productsToShow=[];
    self.Categories = [];
    self.show=true;
    self.brands=[];
    self.loggedIn=CookiesService.isCookie();

    self.init = function () {
        CookiesService.updateCookie();
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
    };

    self.getProducts=function () {
        self.productsToShow=self.Products;
    };
    self.getUnderwear=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryName == "underwear") {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getSkirts=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryName == "skirts") {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getTrousers=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryName == "trousers") {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getShirts=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryName == "shirts") {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
    self.getDresses=function () {
        self.productsToShow = 0;
        self.productsToShow = [];
        var j=0;
        for(let i=0;i<this.Products.length;i++)
            if (this.Products[i].CategoryName == "dresses") {
                self.productsToShow[j] = this.Products[i];
                j++;
            }
    };
}]);