define(["angular", "angular-ui-router"], function (angular) {
    return angular.module('houyi.index', ['ui.router'])
        .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider){
            $urlRouterProvider.when("", "/manage");
            $stateProvider
                .state("manage", {
                    url: "/manage",
                    templateUrl: "tpl/order_manage.html",
                    controller: "orderManage"
                })
                .state("edit", {
                    url:"/edit",
                    templateUrl: "tpl/edit_order.html",
                    controller: "orderEdit"
                })
        }]);
});



