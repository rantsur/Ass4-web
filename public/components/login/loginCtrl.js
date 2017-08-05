/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('loginCtrl', ['$http', '$window', function ($http, $window) {
    var self = this;
    self.login = function() {
        var Indata = {'UserName': self.UserName, 'Password': self.Password };
        self.url = url+ "login";
        $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
            if(response.data.localeCompare("logged in successfully!")==0) {
                alert("Welcome Back!");
                $window.location.href = "/";
            }
            else {
                alert(response.data);
            }
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });
    };
}]);
