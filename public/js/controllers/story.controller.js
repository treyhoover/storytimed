angular.module('storytimed').controller('StoryController', ['$http', '$scope', '$location', function($http, $scope, $location){
    //$location.search('trey');

    //console.log($location.search());

    var socket = io.connect({query: 'user=' + $scope.username});
    $scope.point = {};

    socket.on('new storyPoint', function(msg){
        $scope.points.push(msg);
        $scope.$apply();
        $('.story').scrollTop($('.story')[0].scrollHeight);
    });

    $scope.addPoint = function(story) {
        $http({
            url: '/api/story/add',
            method: "POST",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                storyPoint: {
                    storyId: this.point.storyId || 1,
                    author: $scope.username || '',
                    body: this.point.body || ''
                }
            }
        }).success(function (data, status, headers, config) {
            $scope.point = {};
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
    };

    $http.get('/api/story/show/1')
        .success(function(response){
            $scope.points = response.storyPoints;
        });
}]);