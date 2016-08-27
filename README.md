# Http-Rest-Service
angular &amp; API Rest

<h5>more about restApi</h5>
<p><a href="https://en.wikipedia.org/wiki/Representational_state_transfer">Representational state transfer</a></p>

<h5>Angular App</h5>
```javascript
var app = angular.module("YourApplication", ["HttpRestApp"]);
```

<h5>Angular App Run</h5>
```javascript
var run = function (restService) {
    var httpHeaders = {
        'Content-Type': "application/json",
        'SchoolId': "8ae37cfa-905b-4c71-ad03-bf416d93bdf8"
    }
    restService.setBaseUrl("http://192.168.3.204:9005/api/", httpHeaders);
}

run.$inject = ["RestService"];
app.run(run);
```

<h1>How to use RestService in angular.controller</h1>

```javascript
var controller = function (scope, service) {
  
  ///call getStudents from service
  ///url will send like this: "http://192.168.3.204:9005/api/Student"
  service.getStudents(function(data){
    console.log(data);
  });
  
  ///call getTeacher by id from service
  ///url will send like this: "http://192.168.3.204:9005/api/Teacher/00000000-0000-0000-0000-000000000000"
  var id = "00000000-0000-0000-0000-000000000000";
  service.getTeacher([id],function(data){
    console.log(data);
  });
  
  ///call getStudent by nationalCode from service
  ///url will send like this: "http://192.168.3.204:9005/api/Student?nationalCode=0123456789"
  var params = {
    nationalCode: "0123456789"
  };
  
  service.getStudent(params,function(data){
    console.log(data);
  });
  
  ///call createStudent from service
  ///url will send like this: "http://192.168.3.204:9005/api/Student"
  $scope.clickToPost = function(){
      var command = {firstName: "x", lastname: "y", nationalCode: "0123456789"};
      
      service.createStudent(command, function(response){
        console.log(response);
      });
  }
  
  ///call editStudent from service
  ///url will send like this: "http://192.168.3.204:9005/api/Student"
  $scope.clickToPut = function(){
      var command = {firstName: "x", lastname: "y", nationalCode: "0123456789"};
      
      service.editStudent(command, function(response){
        console.log(response);
      });
  }
  
  ///call deleteStudent by id from service
  ///url will send like this: "http://192.168.3.204:9005/api/Student/00000000-0000-0000-0000-000000000000"
  $scope.clickToDelete = function(){
      var id ="00000000-0000-0000-0000-000000000000";
      
      service.deleteStudent([id], function(response){
        console.log(response);
      });
  }
  
  ///call deleteStudent by id & code from service
  ///url will send like this: "http://192.168.3.204:9005/api/Student?id=00000000-0000-0000-0000-000000000000&code=0123456789"
  ///FromUri: http://www.asp.net/web-api/overview/formats-and-model-binding/parameter-binding-in-aspnet-web-api
  $scope.clickToDelete = function(){
      var command = {id: "00000000-0000-0000-0000-000000000000", code: 1000}
      
      service.deleteStudent(command, function(response){
        console.log(response);
      });
  }
});

controller.$inject = ["$scope", "Service"];
app.controller("Controller", controller);
```

<h1>How to use RestService in angular.service</h1>

<h5>Angular Service: All types of get</h5>
```javascript
var service = function (restService) {
    ///StudentController & TeacherController
    var api = { 
        studentApi: "Student", 
        teacherApi: "Teacher", 
        school: {
          teacherApi: "Teacher",
          url: "http://192.168.3.202:9050/api/"
        } 
    }; 

    ///call get()
    ///null: without parameters
    ///api: "StudentController"
    this.getStudents = function (then) {
        restService.get(null, api.studentApi).then(then);
    };

    ///call get(guid id)
    ///params: [id]
    ///api: "TeacherController"
    this.getTeacher = function (params, then) {
        restService.get(params, api.teacherApi).then(then);
    }
    
    ///call get(NationalCode nationalCode)
    ///params: {nationalCode: "0123456789"}
    ///api: "StudentController"
    ///true: type is "QueryString"
    this.getStudent = function (params, then) {
        restService.get(params, api.studentApi, true).then(then);
    }
    
    ///from api in other host
    ///call get(guid id) 
    ///params: [id]
    ///api: "TeacherController"
    ///false: type isn't "QueryString"
    ///url: "http://192.168.3.202:9050/api/Teacher"
    this.getTeacherFromOtherSchool = function (params, then) {
        restService.get(params, api.school.teacherApi, false, api.school.url).then(then);
    }
    
    ///from api in other host
    ///call get(NationalCode nationalCode) 
    ///params: {nationalCode: "0123456789"}
    ///api: "TeacherController"
    ///true: type is "QueryString"
    ///url: "http://192.168.3.202:9050/api/Teacher"
    this.getTeacherFromOtherSchool = function (params, then) {
        restService.get(params, api.school.teacherApi, true, api.school.url).then(then);
    }
};

service.$inject = ["RestService"];
app.service("Service", service);
```

<h5>Angular Service: post / put</h5>
```javascript
var service = function (restService) {
    ///StudentController & TeacherController
    var api = { 
        studentApi: "Student", 
        teacherApi: "Teacher", 
        school: {
          teacherApi: "Teacher",
          url: "http://192.168.3.202:9050/api/"
        } 
    }; 

    ///call post(studentCommand command)
    ///command: {firstName: "x", lastname: "y", nationalCode: "0123456789"}
    ///api: "StudentController"
    this.createStudent = function (command, then) {
        restService.post(command, api.studentApi).then(then);
    }
    
    ///call put(UpdateStudentCommand command)
    ///command: {firstName: "x", lastname: "y", nationalCode: "0123456789"}
    ///api: "StudentController"
    this.editStudent = function (command, then) {
        restService.put(command, api.studentApi).then(then);
    }

    ///call post(teacherCommand command)
    ///command: {firstName: "x", lastname: "y", nationalCode: "0123456789"}
    ///url: "http://192.168.3.202:9050/api/Teacher"
    this.createTeacher = function (command, then) {
        restService.post(command, api.school.teacherApi, api.school.url).then(then);
    }
    
    ///call put(UpdateTeacherCommand command)
    ///command: {firstName: "x", lastname: "y", nationalCode: "0123456789"}
    ///url: "http://192.168.3.202:9050/api/Teacher"
    this.editTeacher = function (command, then) {
        restService.put(command, api.school.teacherApi, api.school.url).then(then);
    }
};

service.$inject = ["RestService"];
app.service("Service", service);
```

<h5>Angular Service: all types of delete</h5>
```javascript
var service = function (restService) {
    ///StudentController & TeacherController
    var api = { 
        studentApi: "Student", 
        teacherApi: "Teacher", 
        school: {
          teacherApi: "Teacher",
          url: "http://192.168.3.202:9050/api/"
        } 
    }; 

    ///delete with id
    ///call delete(guid id)
    ///params: [id]
    ///api: "StudentController"
    this.deleteStudent = function (params, then) {
        restService.delete(params, api.studentApi).then(then);
    }
    
    ///delete with command (don't forget to use FromUri in your api controller)
    ///call delete([FromUri]RemoveTeacherCommand command)
    ///command: {id: "00000000-0000-0000-0000-000000000000", code: 1000}
    ///api: "TeacherController"
    this.deleteTeacher = function (command, then) {
        restService.delete(command, api.teacherApi, true).then(then);
    }
    
    
    ///delete with id
    ///call delete(guid id)
    ///params: [id]
    ///api: "TeacherController"
    ///false: type isn't "QueryString"
    ///url: "http://192.168.3.202:9050/api/Teacher"
    this.deleteTeacher = function (params, then) {
        restService.delete(params, api.school.teacherApi, false, api.school.url).then(then);
    }
    
    ///delete with command (don't forget to use FromUri in your api controller)
    ///call delete([FromUri]RemoveTeacherCommand command)
    ///command: {id: "00000000-0000-0000-0000-000000000000", code: 1000}
    ///api: "TeacherController"
    ///url: "http://192.168.3.202:9050/api/Teacher"
    this.deleteTeacher = function (command, then) {
        restService.delete(command, api.school.teacherApi, true, api.school.url).then(then);
    }
};

service.$inject = ["RestService"];
app.service("Service", service);
```

<h5>why restService used [], in the get</h5>
```javascript
  var id = "00000000-0000-0000-0000-000000000000";
  service.getTeacher([id],function(data){
    console.log(data);
  });
```

in the rest api as default we have "api/{controller}/{id}", but what if we want have more params as optional like "api/{controller}/{id}/{type}/{grade}", in the RestService we use [] as optional params, for example:

```javascript
  var id = "00000000-0000-0000-0000-000000000000";
  var type = true;
  var grade = 5;
  service.getTeacher([id, type, grade],function(data){
    console.log(data);
  });
```
this service will send api like this: "http://192.168.3.204:9005/api/Teacher/00000000-0000-0000-0000-000000000000/true/grade"

<hr>

<a href="https://www.nuget.org/packages/AngularHttpRest/">nuget package link</a>
