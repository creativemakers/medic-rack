/**
 * This javascript file defines the request handlers that serves
 * as a repository (as of now Mongo) connector
 *
 * @author : creativemakers
 **/
var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');
var isClosed = false;

Repository = function(host, port) {
    var _this = this;
    MongoClient.connect("mongodb://"+host+":"+port+"/medic_rack", function(error, database){
        if (error){
            console.log("error while connecting to mongodb");
        } else {
            database.on('close', function() {
                isClosed = true;
            });
            database.on("reconnect", function(){
                isClosed = false;
            });
            database.medicines = database.collection("medicines");
            _this.db = database;
        }
    });
};

Repository.prototype.getMedicinesByName = function (name, callback) {
    if (isClosed){
        callback({message:"Connection lost to database."});
        return;
    }
    this.db.medicines.find({"name": { $regex: name, $options: "i"}}).toArray(function (error, results) {
        if (error) {
            callback(error);
        } else {
            results.forEach(function(val){
                val._id = val._id.toHexString();
            });
            callback(null, results);
        }
    })
}

Repository.prototype.addMedicines = function (medicines, callback){
    if (isClosed){
        callback({message:"Connection lost to database."});
        return;
    }
    this.db.medicines.insert(medicines, function (error, results){
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
}

Repository.prototype.updateMedicines = function (medicines, callback){
    if (isClosed){
        callback({message:"Connection lost to database."});
        return;
    }
    var errorList = [], resultList = [];
    for (var counter = 0; counter < medicines.length; counter++){
		    	this.db.medicines.findAndModify({
			_id : new ObjectID(medicines[counter]._id)
		}, [], {
			name : medicines[counter].name,
			rack : medicines[counter].rack,
			quant : medicines[counter].quant}, {}, function (error, result){
            if (error) {
                errorList.push(error);
            } else {
            	resultList.push(result);
            }
            if (counter == medicines.length) {
                callback(errorList, resultList);
            }
        });
    }
}

exports.Repository = Repository;
