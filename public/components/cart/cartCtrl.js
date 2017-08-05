/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('cartCtrl', ['$http','localStorageService','CookiesService','$window', function($http,localStorageService,CookiesService) {
    var self = this;
    self.showOrders=false;
    self.loggedIn=CookiesService.isCookie();
    CookiesService.updateCookie();

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
    };

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
    self.isEmpty=function () {
        return self.Products.length==0;
    }
    self.increaseAmount=function (Product) {
        Product.amount= Product.amount+1;
        localStorageService.set(Product.ID, Product);
        self.totalAmount=self.totalAmount+Product.price;
    };
    self.decreaseAmount=function (Product) {
        if( Product.amount!=0) {
            Product.amount = Product.amount - 1;
            localStorageService.set(Product.ID, Product);
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
    };
    self.closeClickModal=function () {
        self.modalProduct=false;
        self.modalOrder=false;
    };
    self.openModal=function (product) {
        self.modalProduct=true;
        self.modalPDescription=product.description;
        self.modalBrand=product.brandName;
        self.modalCategory=product.categoryName;
        self.modalPrice=product.price;
        self.modalImage=product.imagePath;
    };
    self.openModalOrder=function (order) {
        self.modalOrder=true;
        self.modalOrderNo=order.OrderID;
        self.modalOrderDate=order.OrderDate.substring(0,10);
        self.modalShipmentDate=order.ShipmentDate.substring(0,10);
        self.modalTotalAmount=order.TotalAmount;
    };
}]);