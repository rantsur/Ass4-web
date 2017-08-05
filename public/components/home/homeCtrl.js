/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('mainController', ['$http','CookiesService','$cookies','localStorageService', function ($http,CookiesService,$cookies,localStorageService) {
    let self = this;
    self.productsToShow=[];
    self.temp=[];
    self.show=true;
    self.loggedIn=CookiesService.isCookie();
    self.userInfo=CookiesService.getCookie();
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
    self.logout=function () {
        var Indata = {'UserName': self.userInfo.userName};
        self.url = url+ "users/updateLastVisited";
        $http.put(self.url,JSON.stringify(Indata)).then(function(response) {
            console.log(response);
            localStorageService.clearAll();
            $cookies.remove('shop');
            location.reload();
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });

    }
}]);
