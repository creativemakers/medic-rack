'use strict';

/* Controllers */

angular.module('medicRackApp.controllers', [ 'ngGrid','ui.bootstrap' ])
	.controller(
		'searchController',function($scope, $rootScope, medicRackService, $timeout) {
            $scope.alerts = [];
            $scope.name = null;
            $rootScope.updateList = [];
            var checkboxCellTemplate = 
            	'<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-model="row.checked" ng-change="loadById(row)" /></div>';
			$scope.gridOptions = {
				data : 'myData',
                enableCellSelection: false,
                enableRowSelection: false,
                enableCellEditOnFocus: true,
                columnDefs: [{field: '_id', displayName: '#', cellTemplate: checkboxCellTemplate, width:"auto", enableCellEdit: false},
                    {field:'name', displayName:'Name', width: "*"},
                    {field:'rack', displayName:'Rack', width: "auto"},
                    {field:'quant', displayName:'Quantity', width: "*"}]
			};

        $scope.loadById = function(row) {
            if($rootScope.updateList.length > 0){
            	for (var counter = 0; counter < $rootScope.updateList.length; counter++){
            		if (row.checked && row.entity._id != $rootScope.updateList[counter]._id){
                        $rootScope.updateList.push(row.entity);
                        return;
                    } else if (!row.checked && row.entity._id == $rootScope.updateList[counter]._id) {
                    	$rootScope.updateList.splice(counter, 1);
                    	return;
                    }
            	}
            } else {
                $rootScope.updateList.push(row.entity);
            }
        };

        $scope.onSearchClick = function() {
            $scope.isFound = false;
            $scope.myData = [];
            if (!$scope.name){
                return;
            }
			medicRackService.searchByName($scope.name)
                .success(
                    function(res) {
                        if (res && res.length > 0) {
                            $scope.isFound = true;
                            $scope.myData = res;
                        }
                    })
                .error(
                    function(error){
                        $scope.alerts.push({
                            "type": "danger",
                            "content": error.message
                        });
                        $timeout(hideAlert,3000);
                    });
		}
        
        $scope.onUpdateClick = function() {
            $
            medicRackService.updateMedicines($rootScope.updateList).success(function(data){
                $scope.alerts.push({
                    "type": "success",
                    "content": "Medicines updated successfully."
                });	
                $timeout(hideAlert,3000);
            }).error(function(error){
                $scope.alerts.push({
                    "type": "danger",
                    "content": error
                });
                $timeout(hideAlert,3000);
            });
            $rootScope.updateList = [];
        }
        
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        

        var hideAlert = function() {
            $("#statusMsg").fadeOut(1000);
            $timeout(function(){
                $scope.alerts = [];
                $("#statusMsg").show();
            },1000);
        };

	})
	.controller('createBillController',function($scope, $rootScope, medicRackService, $timeout) {
		$scope.alerts = [];
        $scope.rowList = [];
        $scope.totalPrice = 0.00;
        $rootScope.updateList.forEach(function (val){
        	$scope.rowList.push({
        		medicine_id: val._id,
        		name: val.name,
        		rack: val.rack,
        		quant: "",
        		rate: "",
        		price: ""
        	});
        });
        
        $scope.calculatePrice = function(row) {
        	row.price = row.quant*row.rate;
        	$scope.totalPrice = 0.00;
        	$scope.rowList.forEach(function (val){
        		$scope.totalPrice += val.price;
        	});
        };
        
        $scope.onSubmitClick = function() {
            console.log("bill generated");
        };
        
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.hideAlert = function() {
            $("#statusMsg").fadeOut(1000);
            $timeout(function(){
                $scope.alerts = [];
                $("#statusMsg").show();
            },1000);
        };
	})
	.controller('addController', function($scope, medicRackService, $timeout) {
			$scope.alerts = [];
            $scope.rowList = [ {
                name : "",
                rack : "",
                quant: ""
            } ];

            $scope.onAddClick = function() {
                $scope.rowList.push({
                    name : "",
                    rack : "",
                    quant: ""
                });
            }

            $scope.onSubmitClick = function() {
                $
                medicRackService.addMedicines($scope.rowList).success(function(data){
                    $scope.alerts.push({
                        "type": "success",
                        "content": "Medicines added successfully."
                    });
                    $timeout(hideAlert,3000);
                }).error(function(error){
                    $scope.alerts.push({
                        "type": "danger",
                        "content": error.message
                    });
                    $timeout(hideAlert,3000);
                });
            }


            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            var hideAlert = function() {
                $("#statusMsg").fadeOut(1000);
                $timeout(function(){
                    $scope.alerts = [];
                    $("#statusMsg").show();
                },1000);
            };


})
.controller('menuController', function($scope) {

	$scope.menu = [ {
		url : "/search",
		desc : "Search & Update"
	}, {
		url : "/add",
		desc : "Add Medicine"
	} ];

});