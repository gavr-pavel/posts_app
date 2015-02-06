angular.module 'posts_app'

.controller 'PostDetailsCtrl', ['$scope', 'posts', '$routeParams', '$location', ($scope, posts, $routeParams, $location) ->

    $scope.$watch (-> posts.get $routeParams.postId), (updatedPost) =>
        @post = angular.copy updatedPost

    @removePost = =>
        if confirm "Вы уверены, что хотите удалить запись?"
            posts.remove $routeParams.postId
            $location.path '/posts'

    return @

]