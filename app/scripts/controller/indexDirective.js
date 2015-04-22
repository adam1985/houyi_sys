define(["angular", "./indexService",  "component/bootstrap-datepicker", "ztree"], function (angular) {
    return angular.module('houyi.index')
        .directive("datePicker", function(){
            return {
                restrict: "A",
                require: "?ngModel",
                link: function($scope, $element, $attrs, $ngModel){

                   $attrs.$observe('id', function(){

                   });


                    $element.datepicker({
                        format: 'yyyy-mm-dd',
                        language: 'zh-CN'
                    });

                    $element.next('.input-group-addon').on('click', function(){
                        $element.focus();
                    });

                }
            }
        })

        .directive("ztree", function(){
            return {
                restrict: "A",
                controller: ["$scope", "serviceData", function($scope, serviceData){
                    $scope.ztree = serviceData.ztree;
                }],
                controllerAs: "ztreeCtrl",
                link: function($scope, $element, $attrs, ztreeCtrl){

                    var setting = {
                        data: {
                            simpleData: {
                                enable: true
                            }
                        }
                    };
                    $.fn.zTree.init($element, setting, $scope.ztree);
                }
            }
        });
});



