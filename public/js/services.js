'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('medicRackApp.services', []).factory('medicRackService', function($http) {

    var medicRackServiceAPI = {};

    medicRackServiceAPI.searchByName = function(name) {
        return $http({
            method : "GET",
            url : "/searchByName/"+name
        });
    }

    medicRackServiceAPI.addMedicines = function(medicines) {
        return $http({
            method : "POST",
            url : "/add",
            data: medicines
        });
    }
    
    medicRackServiceAPI.updateMedicines = function(medicines) {
        return $http({
            method : "POST",
            url : "/update",
            data: medicines
        });
    }

    return medicRackServiceAPI;

});

