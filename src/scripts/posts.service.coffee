angular.module 'posts_app'

.service 'posts', ['$rootScope', '$window', 'postsDummy', ($rootScope, $window, postsDummy) ->

    @get = (id) =>
        for post in @list
            if post.id is id
                return post

    @create = ({title, text}) =>
        newPost = {id: getNewIndex(), title, text}
        @list.unshift newPost
        save()

    @update = ({id, title, text}) =>
        for post in @list
            if post.id is id
                post.title = title
                post.text = text
                return save()

    @remove = (id) =>
        for post, i in @list
            if post.id is id
                @list.splice i, 1
                return save()

    getNewIndex = ->
        newIndex = localStorage.getItem('posts_new_index')
        localStorage.setItem 'posts_new_index', +newIndex+1
        newIndex

    save = =>
        localStorage.setItem 'posts', angular.toJson @list
        @

    init = =>
        if localStorage.getItem 'posts_initialized'
            @list = angular.fromJson localStorage.getItem 'posts'
        else
            @list = postsDummy()
            save()
            localStorage.setItem 'posts_new_index', @list.length
            localStorage.setItem 'posts_initialized', true

    init()

    $window.addEventListener 'storage', (evt) =>
        if evt.key isnt 'posts' then return
        $rootScope.$apply =>
            @list = angular.fromJson(localStorage.getItem 'posts') or []

    return @

]
