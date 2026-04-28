'use strict';

var http = require('http');
var Datastore = require('nedb');
var db = new Datastore({ inMemoryOnly: true });
var ODataServer = require('simple-odata-server');

var model = {
    namespace: 'jsreport',
    entityTypes: {
        'EmployeeType': {
            '_id': { 'type': 'Edm.Int32', key: true },
            'EmployeeID': { 'type': 'Edm.Int32' },
            'Guid': { 'type': 'Edm.Guid' },
            'FirstName': { 'type': 'Edm.String' },
            'LastName': { 'type': 'Edm.String' },
            'DOB': { 'type': 'Edm.DateTime' },
        }
    },
    entitySets: {
        'Employees': {
            entityType: 'jsreport.EmployeeType'
        }
    }
};

createServer(9000);
function createServer(port) {
    var odataServer = ODataServer('http://localhost:' + port)
        .model(model)
        .onNeDB(function (es, cb) { cb(null, db); });

    http.createServer(odataServer.handle.bind(odataServer)).listen(port, function () {       
        setTimeout(function () {            
            console.log(port);
        }, 1000);        
    }).on('error', function (err) {
        if (err.code === 'EADDRINUSE') {            
            createServer(port + 1);
        }
    });
}

db.insert({
    '_id': 1,
    'EmployeeID': 1001,
    'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c7',
    'FirstName': 'Nancy',
    'LastName': 'Davolio',
    'DOB': new Date('October 13, 1989 11:13:00')
});
db.insert({
    '_id': 2,
    'EmployeeID': 1002,
    'Guid': 'db2d2186-1c29-4d1e-88ef-a127f521b9c6',
    'FirstName': 'Fuller',
    'LastName': 'Andrew',
    'DOB': new Date('November 10, 1990 01:13:00')
});
db.insert({
    '_id': 3,
    'EmployeeID': 1003,
    'Guid': '6F9619FF-8B86-D011-B42D-00C04FC964FF',
    'FirstName': 'Leverling',
    'LastName': 'Janet',
    'DOB': new Date('October 5, 1991 12:13:00')
});
db.insert({
    '_id': 4,
    'EmployeeID': 1004,
    'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c8',
    'FirstName': 'Peacock',
    'LastName': 'Margaret',
    'DOB': new Date('October 1, 1993 04:13:00')
});
db.insert({
    '_id': 5,
    'EmployeeID': 1005,
    'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9',
    'FirstName': 'Buchanan',
    'LastName': 'Steven',
    'DOB': new Date('October 2, 1990 08:13:00')
});
db.insert({
    '_id': 6,
    'EmployeeID': 1006,
    'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c0',
    'FirstName': 'Suyama',
    'LastName': 'Michael',
    'DOB': new Date('October 3, 1992 06:13:00')
});
db.insert({
    '_id': 7,
    'EmployeeID': 1007,
    'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c3',
    'FirstName': 'King',
    'LastName': 'Robert',
    'DOB': new Date('October 10, 1995 10:13:00')
});
db.insert({
    '_id': 8,
    'EmployeeID': 1008,
    'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c5',
    'FirstName': 'Callahan',
    'LastName': 'Laura',
    'DOB': new Date('October 15, 1996 06:13:00')
});
db.insert({
    '_id': 9,
    'EmployeeID': 1009,
    'Guid': 'db2d2186-1c29-4d1e-88ef-a127f521b9c7',
    'FirstName': 'Dodsworth',
    'LastName': 'Anne',
    'DOB': new Date('October 7, 1991 09:13:00')
});