angular.module("HttpRestApp", []).service("RestService", function ($rootScope, $http, $q, cfpLoadingBar, $interval, $filter) {
    var baseUrl, headers;

    this.testCurrentHeader = function () {
        console.log("HttpRestApp > RestService > headers", headers);
    }

    this.setBaseUrl = function (url, httpHeaders) {
        baseUrl = url;
        headers = httpHeaders;
    };

    this.addHeader = function (key, value) {
        headers[key] = value;
    }

    var httpConfig = function (method, api, params, data, isQueryString, url) {
        $rootScope.errors = [];

        cfpLoadingBar.start();

        var routeParameters = "";
        var httpConfigUrl;

        if (isQueryString) {
            httpConfigUrl = baseUrl + api;
        } else {
            if (params === null) {
                httpConfigUrl = baseUrl + api;
            } else {
                if (params.length === 1) {
                    httpConfigUrl = baseUrl + api + "/" + params[0];
                } else {
                    angular.forEach(params, function (parameter) {
                        routeParameters += parameter + "/";
                    });
                    httpConfigUrl = baseUrl + api + "/" + routeParameters;
                }
            }
        }

        var deferred = $q.defer();
        $http({
            method: method,
            async: true,
            headers: headers,
            data: data,
            params: params,
            url: url ? url + api : httpConfigUrl
        }).success(function (response) {
            deferred.resolve(response);
            cfpLoadingBar.complete();
        }).error(function (error) {
            console.error("HttpRestApp error:", error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.get = function (params, api, isQueryString, url) {
        return httpConfig("GET", api, params, null, isQueryString, url);
    }

    this.post = function (command, api, url) {
        return httpConfig("POST", api, null, command, false, url);
    }

    this.put = function (command, api, url) {
        return httpConfig("PUT", api, null, command, false, url);
    }

    this.delete = function (params, api, isQueryString, url) {
        return httpConfig("DELETE", api, params, null, isQueryString, url);
    }
});