//this is only an example, handling everything is yours responsibilty !

var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'mortzu',
    password: 'Mokaka22',
    server: 'mordb.database.windows.net',
    options: {encrypt: true, database: 'ShopDB'}
};

var connection;

//----------------------------------------------------------------------------------------------------------------------
exports.Select = function(query) {
    return new Promise(function(resolve,reject) {
        connection = new Connection(config);
        var ans = [];
        var properties = [];
        connection.on('connect', function(err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            console.log('connection on');
            var dbReq = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            dbReq.on('columnMetadata', function (columns) {
                columns.forEach(function (column) {
                    if (column.colName != null)
                        properties.push(column.colName);
                });
            });
            dbReq.on('row', function (row) {
                var item = {};
                for (i=0; i<row.length; i++) {
                    item[properties[i]] = row[i].value;
                }
                ans.push(item);
            });

            dbReq.on('requestCompleted', function () {
                console.log('request Completed: '+ dbReq.rowCount + ' row(s) returned');
                console.log(ans);
                connection.close();
                resolve(ans);
            });
            connection.execSql(dbReq);
        });
    });
};
//----------------------------------------------------------------------------------------------------------------------
exports.InsertOrder = function(toInsert) {
    return new Promise(function(resolve,reject) {
        let connection = new Connection(config);
        connection.on('connect', function (err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            var request = new Request("INSERT INTO Orders VALUES (@UserName,@OrderDate,@ShipmentDate,@Currency,@TotalAmount)",
                function (err) {
                    if (err) {
                        console.log(err);
                    };
                });
            request.on('requestCompleted', function () {
                console.log('request Completed: '+ request.rowCount + ' row(s) returned');
                connection.close();
            });

            request.addParameter('UserName', TYPES.NVarChar, toInsert.UserName);
            request.addParameter('OrderDate', 	TYPES.Date, toInsert.OrderDate);
            request.addParameter('ShipmentDate', TYPES.Date, toInsert.ShipmentDate);
            request.addParameter('Currency', TYPES.NVarChar, toInsert.Currency);
            request.addParameter('TotalAmount', TYPES.Money, toInsert.TotalAmount);

            connection.execSql(request);
        });
    });
};
//----------------------------------------------------------------------------------------------------------------------
exports.InsertClients = function(toInsert) {
    return new Promise(function(resolve,reject) {
        connection = new Connection(config);
        connection.on('connect', function (err) {
            if(err)
                reject(err);
            let request = new Request("INSERT INTO Clients (UserName, Password, FirstName,LastName,Address,City,Country,Phone,Cellular,Mail,CreditCardNumber,isAdmin)" +
                " VALUES (@UserName, @Password, @FirstName,@LastName,@Address,@City,@Country,@Phone,@Cellular,@Mail,@CreditCardNumber,@isAdmin)",
                function (err) {
                    if (err) {
                       reject(err);
                    }
                    // connection.close();
                    resolve();
                });
            // request.on('requestCompleted', function () {
            //     console.log('request Completed: ' + request.rowCount + ' row(s) returned');
            //     connection.close();
            //     resolve();
            // });
            request.addParameter('UserName', TYPES.NVarChar, toInsert.UserName);
            request.addParameter('Password', TYPES.NChar, toInsert.Password);
            request.addParameter('FirstName', TYPES.NVarChar, toInsert.FirstName);
            request.addParameter('LastName', TYPES.NVarChar, toInsert.LastName);
            request.addParameter('Address', TYPES.NVarChar, toInsert.Address);
            request.addParameter('City', TYPES.NVarChar, toInsert.City);
            request.addParameter('Country', TYPES.NVarChar, toInsert.Country);
            request.addParameter('Phone', TYPES.NVarChar, toInsert.Phone);
            request.addParameter('Cellular', TYPES.NVarChar, toInsert.Cellular);
            request.addParameter('Mail', TYPES.NVarChar, toInsert.Mail);
            request.addParameter('CreditCardNumber', TYPES.NVarChar, toInsert.CreditCardNumber);
            request.addParameter('isAdmin', TYPES.Int, toInsert.isAdmin);
            connection.execSql(request);
        });
    });
};
//----------------------------------------------------------------------------------------------------------------------
exports.InsertQuestions = function(toInsert) {
    return new Promise(function(resolve,reject) {
        connection = new Connection(config);
        connection.on('connect', function (err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            var request = new Request("INSERT INTO QuestionsForUser VALUES (@UserName, @QuestionID, @Answer)",
                function (err) {
                    if (err) {
                        console.log(err);
                    };
                });
            request.addParameter('UserName', TYPES.NVarChar, toInsert.UserName);
            request.addParameter('QuestionID', TYPES.Int, toInsert.QuestionID);
            request.addParameter('Answer', TYPES.NVarChar, toInsert.Answer);

            connection.execSql(request);
        });
    });
};

//----------------------------------------------------------------------------------------------------------------------
exports.InsertPerfences = function(query) {
    if(!connection)
        connection = new Connection(config);
    connection.on('connect', function (err) {
        var request = new Request(query,
            function (err) {
                if (err) {
                    console.log(err);
                };
                connection.close();
            });
        request.on('requestCompleted', function () {
            connection.close();

        });
        connection.execSql(request);
    });
};

exports.Insert= function(query) {
    return new Promise(function(resolve,reject) {
        connection = new Connection(config);
        connection.on('connect', function (err) {
            if(err)
            {
                reject(err);
                return;
            }

            let request = new Request(query, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            connection.execSql(request);
        });
    });
};










