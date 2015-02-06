angular.module 'posts_app', [
    'ngRoute'
]

.run ['$rootScope', '$window', '$document', ($rootScope, $window, $document) ->

    docRoot = $document[0].documentElement # FF scroll root
    docBody = $document[0].body # webkit scroll root

    scrollTop = (y) ->
        if y?
            docRoot = docBody = y
        else
            docRoot.scrollTop or docBody.scrollTop

    $window.addEventListener 'scroll', throttle (evt) =>
        if docBody.scrollHeight < scrollTop() + docBody.clientHeight + 150
            $rootScope.$apply ->
                $rootScope.$emit 'scrollEndApproach'
    , 100
]

throttle = (fn, delay) ->
    return fn if delay is 0
    timer = false
    return ->
        return if timer
        timer = true
        setTimeout (-> timer = false), delay unless delay is -1
        fn arguments...
