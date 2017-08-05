/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('aboutCtrl', ['$http', '$window', '$location', function ($http, $window, $location) {
    var self = this;
    self.closeAbout = function() {
        $location.path( "/" );
    };
}]);