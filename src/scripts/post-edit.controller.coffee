angular.module 'posts_app'

.controller 'PostEditCtrl', ['$scope', 'posts', '$routeParams', '$location', ($scope, posts, $routeParams, $location) ->

    @post = angular.copy posts.get $routeParams.postId

    @submit = =>
        if $scope.post_edit.$valid
            posts.update @post
            $location.path "/posts/#{ @post.id }"

    return @

]
