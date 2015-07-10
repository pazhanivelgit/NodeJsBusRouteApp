	//function mysqlConnector() {}
//console.log("Starting");
function mysqlConnector(req, res, next) {
	console.log('in mysqlConnector');
	var mysqldb = require('mysql');
    var logger = require('../common/logger.js');
    var config = require('../config/config.json');
    
    var FromLocId = req.body.data.FromLocId;
    var ToLocId = req.body.ToLocId;
    
    console.log("Request body:" + JSON.stringify(req.body));
    console.log("FromLoc:"+ FromLocId);

	console.log("Inside mysqlConnector");
	//From connections.json
	//get the host name
    var hostName = config.Connection.Host;
    
    if (hostName == undefined || hostName == '') {
        res.statusCode = "500";
        var statusResponse = {
            'err': 'missed hostName Name'
        };
        res.send(statusResponse);
        return;
    }


	//get the port number
	var portNumber = config.Connection.Port;
    
    	//get the user name
	var userName = config.Connection.UserName;
    
    if (userName == undefined || userName == '') {
        res.statusCode = "500";
        var statusResponse = {
            'err': 'missed userName Name'
        };
        res.send(statusResponse);
        return;
    }

	//get the password
	
    var password = config.Connection.Password;
  

	//get the database name from the request body
	var databaseName = config.Connection.DbName; // req.body.database;
    
    if (databaseName == undefined || databaseName == '') {
        res.statusCode = "500";
        var statusResponse = {
            'err': 'missed Server Name'
        };
        res.send(statusResponse);
        return;
    }
	//get the timeout
	var timeout = config.Connection.TimeOut;//req.connectionDetails.TIMEOUT;

    if (timeout==undefined || timeout=='')
    {
        timeout = 10000;
    }

	var connString = {};
	connString.host = hostName;
	//set the user name
	connString.user = userName;
	//set the password
	connString.password =password;
	//set the database name
	connString.database = databaseName;

    connString.connectTimeout = parseInt(timeout);

	var mySQLConnection = mysqldb.createConnection(connString);
	//mySQLConnection.connect();
	//console.log("My SQL Connection" + mysqlConnection)

	//var pool = mysqldb.createPool(connString);

	mySQLConnection.connect(function(err){

		if (err) {

		    res.statusCode="404";
    		var statusResponse = {
                'err': 'Could not establish the connection'
            };

            logger.log('Could not establish the connection: ' + err);
            mySQLConnection.end();
		    res.send(statusResponse);

			//res.json({"errorCode": 100, "errorMessage": "Error in connecting to database" + err});
			return;
		}
		
		var queryString = 'select * from testdb.user';
        //var queryString = req.body.query;
        
        if (queryString == undefined || queryString == '') {
            res.statusCode = "500";
            var statusResponse = {
                'err': 'missed query String'
            };
            res.send(statusResponse);
            return;
        }

        //var methodName = req.body.method;
        //if (methodName == undefined || methodName == '') {
        //    res.statusCode = "500";
        //    var statusResponse = {
        //        'err': 'missed query String'
        //    };
        //    res.send(statusResponse);
        //    return;
        //}
        
        mySQLConnection.query(queryString, function (err, rows, fields){

		if(err) {
			mySQLConnection.end();
			resp.statusCode="400";
		    var statusResponse = {"err": "Error executing the operation "};
			res.send(statusResponse);
			logger.log('Error executing the operation: ' +err);
			//res.send(JSON.stringify(err));
		}
		else
		{
			logger.log("Fetching data");
			mySQLConnection.end();			
			res.statusCode = "200";
                res.send(JSON.stringify(rows));
                console.log(JSON.stringify(rows));
		}
		});
		//connection.end();
	});
	}
module.exports = mysqlConnector;



