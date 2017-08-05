/**
 * Created by mortzubery on 02/08/2017.
 */
app.controller('registerCtrl', ['$http', '$window', '$location', function ($http, $window, $location) {
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
        var day = self.getD();
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
                'lastVisited' : day ,
                'answers':[self.ans1, self.ans2],
                'questions':[self.selectedQuestion.QuestionID,self.selectedQuestion2.QuestionID],
                'categories': checkboxesChecked
            };
        self.url= url +"register";
        $http.post(self.url,JSON.stringify(Indata)).then(function(response) {
            self.message = response.data;
            alert("Registration Complete");
            $location.path( "/login" );
        }, function(errResponse) {
            console.error('Error while fetching notes');
        });
    };

    self.getD = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        today = yyyy+'-'+mm+'-'+dd;
        return today;
    }
}]);