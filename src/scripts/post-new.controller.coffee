angular.module 'posts_app'

.controller 'PostNewCtrl', ['$scope', '$location', 'posts', ($scope, $location, posts) ->

    @submit = =>
        if $scope.post_new.$valid
            posts.create @post
            $location.path '/posts'

    return @

]
