/**
 * Created by mortzubery on 02/08/2017.
 */
app.factory('CookiesService', ['$cookies', function ($cookies) {
    let service = {};
    service.cookie=null;
    service.getCookie =function () {
        if(service.cookie==null)
        {
            let cookie= new Object();
            cookie.userName= "guest";
            cookie.lastVisited=null;
            return cookie;
        }
        let cookieString= service.cookie;
        let startUM= cookieString.indexOf("UserName")+8+3;
        let startLV= cookieString.indexOf("LastVisited")+11+3;
        let endUM=cookieString.indexOf('"',startUM);
        let endLV=startLV+10;
        let cookie= new Object();
        cookie.userName=cookieString.substring(startUM,endUM);
        cookie.lastVisited=cookieString.substring(startLV,endLV);
        return cookie;

    };
    service.isCookie =function () {

        service.cookie=$cookies.get('shop');
        if(service.cookie!=null)
            return true;
        return false;
    };
    service.updateCookie=function () {
        try{
            if(service.cookie!=null){
                let cookieString= service.cookie;
                let startLV= cookieString.indexOf("LastVisited")+11+3;

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
                let oldS=cookieString.substring(0,startLV);
                let newString=oldS+""+today+"\"}";
                $cookies.put('shop', newString);
            }
        }
        catch (exp){

        }
    }
    return service;
}]);