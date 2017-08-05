/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('restoreCtrl', ['$http', function ($http) {
    var self = this;
    self.message;
    self.init = function () {
        self.emptyQuestions=true;
        self.gotQuestions=false;
        self.qotPass=false;
        self.noUser = false;
    };

    self.getQuestions = function () {
        self.url = url + "getUsersQuestions/"+self.userName;
        $http.get(self.url).then(function (response) {
            self.Questions = response.data;
            if(self.Questions.length<1) {
                self.noUser = true;
                self.nsu = "No Such User Exist"
            }
            else {
                self.gotQuestions = true;
            }
            self.emptyQuestions = false;
        }, function (errResponse) {
            console.error('Error while fetching notes');
        });
    };
    self.restorePass = function() {
        var Indata = {
            'UserName': self.userName,
            'QuestionID':[self.Questions[0].QuestionID, self.Questions[1].QuestionID],
            'Answers':[self.ans1, self.ans2]
        };
        self.url = url+ "restorePassword";
        $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
            self.message = response.data;
            self.restoredPass = self.message[0].Password;
            if (self.restoredPass==null)
                self.restoredPass = "At least one of the answers are wrong"
            self.gotQuestions=false;
            self.gotPass=true;
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });
    };
}]);