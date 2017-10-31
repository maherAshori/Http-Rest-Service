/*
    Maher Ashori    
    maher.ashori@gmail.com
    1/1/2017
*/
/*

	Edited by Ramin Farajpour (raminfarajpour93@gmail.com)
	Added Feature : Add Status Function For handling Http Response Errors

*/

angular.module("HttpRestApp", []).service("RestService", function ($http, $q) {
	
    var baseUrl, headers, arraybuffer;
	
    var statusFunctions = {};
	
    this.testCurrentHeader = function () {
        console.log("HttpRestApp > RestService > headers", headers);
    };

    this.setBaseUrl = function (url, httpHeaders) {
        baseUrl = url;
        headers = httpHeaders;
    };

    this.addHeader = function (key, value) {
        headers[key] = value;
    };

    this.activeArrayBuffer = function () {
        arraybuffer = true;
    };

    this.deactiveArrayBuffer = function () {
        arraybuffer = false;
    };

    this.addStatusFunction = function (status, statusFunction) {
        statusFunctions[status.toString()] = statusFunction;
    };

    var httpConfig = function (method, api, params, data, isQueryString, url, needsResponse) {
        var routeParameters = "";
        var httpConfigUrl;
        var httpUrl;

        url ? httpUrl = url : httpUrl = baseUrl;

        if (isQueryString) {
            httpConfigUrl = httpUrl + api;
        } else {
            if (params === null || angular.isUndefined(params)) {
                httpConfigUrl = httpUrl + api;
            } else {
                if (params.length === 1) {
                    httpConfigUrl = httpUrl + api + "/" + params[0];
                } else {
                    angular.forEach(params, function (parameter) {
                        routeParameters += parameter + "/";
                    });

                    httpConfigUrl = httpUrl + api + "/" + routeParameters;
                }

                params = null;
            }
        }

        var httpObject = {
            method: method,
            async: true,
            headers: headers,
            data: data,
            params: params,
            url: httpConfigUrl
        };

        if (arraybuffer) {
            httpObject["responseType"] = "arraybuffer";
        }

        var deferred = $q.defer();

        var responseProvider =
        {
            types: {
                success: "success",
                error: "error"
            },
            providerFunction: function (responseType, responseObject) {

                var retObject = responseObject.data;
                var status = responseObject.status.toString();

                if (needsResponse) {
                    retObject = responseObject;
                }

                if (responseType === this.types.success) {
                    deferred.resolve(retObject);
                } else if (responseType === this.types.error) {
                    deferred.reject(retObject);
                    console.error("HttpRestApp error:", responseObject.data);
                }

                if (angular.isDefined(statusFunctions[status])) {
                    statusFunctions[status]();

                }
            }
        };

        $http(httpObject).success(function (resData, resStatus, resHeaders, resConfig) {
            var response = {
                data: resData,
                status: resStatus,
                headers: resHeaders,
                config: resConfig
            };

            responseProvider.providerFunction(responseProvider.types.success, response);
        })
        .error(function (errData, errStatus, errHeaders, errConfig) {
            var error = {
                data: errData,
                status: errStatus,
                headers: errHeaders,
                config: errConfig
            };

            responseProvider.providerFunction(responseProvider.types.error, error);
        });

        return deferred.promise;
    };

    this.get = function (params, api, isQueryString, url, needsResponse) {
        return httpConfig("GET", api, params, null, isQueryString, url, needsResponse);
    };

    this.post = function (command, api, url, needsResponse) {
        return httpConfig("POST", api, null, command, false, url, needsResponse);
    };

    this.put = function (command, api, url, needsResponse) {
        return httpConfig("PUT", api, null, command, false, url, needsResponse);
    };

    this.delete = function (params, api, isQueryString, url, needsResponse) {
        return httpConfig("DELETE", api, params, null, isQueryString, url, needsResponse);
    };
});