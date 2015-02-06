angular.module 'posts_app'

.controller 'NavCtrl', ['$scope', '$rootScope', '$location', ($scope, $rootScope, $location) ->

    @postFilter = $rootScope.postFilter = {
        title: ''
    }

    $scope.$location = $location

    return @

]
