var express = require('express');
var request = require('request');

var logger = require('../common/logger.js');
var config = require('../config/config.json');
var mysqlConnector = require('../connection/mysql.js')
//var mssqlConnector = require('../connectors/rdbms/mssqlConnector.js')
//var mariadbConnector = require('../connectors/rdbms/mariadbConnector.js')
//var oracleConnector = require('../connectors/rdbms/oracleConnector.js')
//var postgresConnector = require('../connectors/rdbms/postgresConnector.js')


var mysqlRouter = express.Router();

//a global connection cache for connection details.
//connectionCache = {};

/* GET home page. */
mysqlRouter.all('/mysql/:connectionId', mysqlConnector)
//rdbmsRouter.all('/mssql/:connectionId', mssqlConnector)
//rdbmsRouter.all('/maria/:connectionId', mariadbConnector)
//rdbmsRouter.all('/oracle/:connectionId', oracleConnector)
//rdbmsRouter.all('/postgres/:connectionId', postgresConnector)

module.exports = mysqlRouter;