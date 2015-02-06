angular.module 'posts_app'

.controller 'PostListCtrl', ['$scope', 'posts', '$rootScope', ($scope, posts, $rootScope) ->

    @posts = posts

    @postsQuantity = 5

    @removePost = (post) =>
        if confirm "Вы уверены, что хотите удалить запись «#{ post.title }»?"
            posts.remove post.id

    $rootScope.$on 'scrollEndApproach', =>
        if @postsQuantity < posts.list.length
            @postsQuantity += 5

    return @

]