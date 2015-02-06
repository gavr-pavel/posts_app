angular.module 'posts_app'

.config ['$routeProvider', ($routeProvider) ->
 
    $routeProvider
        .when '/posts', {
            controller: 'PostListCtrl'
            controllerAs: 'vm'
            templateUrl: 'post_list.html'
        }
        .when '/posts/new', {
            controller: 'PostNewCtrl'
            controllerAs: 'vm'
            templateUrl: 'post_new.html'
        }
        .when '/posts/:postId', {
            controller: 'PostDetailsCtrl'
            controllerAs: 'vm'
            templateUrl: 'post_details.html'
        }
        .when '/posts/:postId/edit', {
            controller: 'PostEditCtrl'
            controllerAs: 'vm'
            templateUrl: 'post_edit.html'
        }
        .when '/', {
            redirectTo: '/posts'
        }
        .otherwise {
            templateUrl: 'not_found.html'
        }

]
