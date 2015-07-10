var express = require('express');

var logger = require('../common/logger.js');
var config = require('../config/config.json');
var connections = require('../config/connections.json');

//console.log('connections!!!!!!! ' +JSON.stringify(connections));
connectionCache = {};

function connectionIdentifier(req, res, next) {
  
  var companyId = req.headers.companyid;
  var connId = req.params.connectionId;

  var dynamicCSRF;
  dynamicCSRF = req.headers.csrf_token;

  getConnectionDetails(connId, companyId, dynamicCSRF, function(err, connectionDetails) {
    if(!err) {
      req.connectionDetails = connectionDetails;
      next();
    }
    else {
      res.end(err.message);
    }
  });
}

function getConnectionDetails(connId, companyId, dynamicCSRF, c\allback) {

  //Get the connection from cache if already available
  var connectionDetails;
  connectionDetails = getConnectionFromCache(connId);
  
  if(connectionDetails){
    callback(null, connectionDetails);
  }
  else {
    getConnectionFromSource(connId, companyId, dynamicCSRF, function(err, connectionDetails){
      if(!err) {
        addConnectionToCache(connId, connectionDetails);
      }
      callback(err, connectionDetails);
    });
  }
}

//The underlying cache implementation can be changed later
function getConnectionFromCache(connId) {
    return connectionCache[connId];
}

//The underlying cache implementation can be changed later
function addConnectionToCache(connId, connection) {
  connectionCache[connId] = connection;
}

function getConnectionFromSource(connId, companyId, dynamicCSRF, callback) {
  
  //ToDo Replace this implementation with the commented one below when TJ core is ready
  var thisConnection = findConnectionById(connId, connections);
  if (thisConnection != undefined) {
    callback(null, thisConnection);
  }
  else {
    var err = new Error("Could not find the specified connection");
    callback(err, null);
  }

  /*
  //ToDo The below has to be uncommented once integration with TJ core is started
  //If dynamic CSRF was not passed in the request, 
  //use the configured static CSRF
  var csrf = (dynamicCSRF || config.staticCSRF);
  var tjURL = config.tjURL;
  var options = {
    url:tjURL,
    qs:{
      'CONNECTION_ID':connId
    },
    headers: {
      'CSRF_Token':csrf
    },
    "rejectUnauthorized": false
  };

  //If the request to TJ core has to go through a proxy
  if (!config.systemProxy){
    options.proxy = config.systemProxy;
  }
  //callback(connectionDetails);
  request(options, function(err, res, body){
    if(!err && res.statusCode == 200){
      //ToDo Get the connection details from the response and
      //construct the connectionDetails object
      //connectionDetails.server = res.server;
      //console.log('response - ' + JSON.stringify(JSON.parse(res.body)[0].CONNECTION_TYPE));
      callback(connectionDetails);
    }
    else {
      logger.log('error getting connectionDetails');
      console.log(err);
      //logger.log(err + ' ' + res.statusCode);
      //ToDo the below line to be deleted after testing
      callback(connectionDetails);
    }
  });
  */
}

//This function can be removed when the connections are retrieved from TJ core
function findConnectionById(connectionId, connections) {
  for(var i=0; i<connections.length; i++) {
    if(connections[i].CONNECTION_ID == connectionId) {
      return connections[i];
    }
  }
}

module.exports = connectionIdentifier;