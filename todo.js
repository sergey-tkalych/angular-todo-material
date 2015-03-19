(function(){
	"use strict";

	angular
		.module('todo', [
			'ngMaterial'
		])
		.constant('Setting', {
			storageKey: 'todoList'
		})
		.run([
			'Setting',
			function(Setting){
				var todoList = localStorage.getItem(Setting.storageKey);
				if(!todoList){
					localStorage.setItem(Setting.storageKey, JSON.stringify([]));
				}
			}
		])
		.factory('ToDo', [
			'Setting',
			function(Setting){
				var list = JSON.parse(localStorage.getItem(Setting.storageKey));

				function getList(){
					return list;
				}

				function add(todo){
					todo = angular.copy(todo);
					todo.id = (new Date()).getTime();
					todo.done = false;
					list.unshift(todo);
					save();
				}

				function remove(todo){
					for(var i = 0; i < list.length; i++){
						if(list[i].id === todo.id){
							list.splice(i, 1);
							save();
							break;
						}
					}
				}

				function save(){
					localStorage.setItem(Setting.storageKey, JSON.stringify(list));
				}

				return {
					getList: getList,
					add: add,
					done: save,
					remove: remove
				}
			}
		])
		.controller('toDoCtrl', [
			'ToDo',
			function(ToDo){
				this.list = ToDo.getList();
				this.todo = defaultToDo();

				this.saveToDo = function(){
					ToDo.add(this.todo);
					this.todo = defaultToDo();
				};

				this.doneToDo = ToDo.done;

				this.removeToDo = ToDo.remove;

				function defaultToDo(){
					return {text: ''};
				}
			}
		])
		.directive('todoForm', [
			function(){
				return {
					restrict: 'E',
					templateUrl: 'partials/todo-form.html'
				}
			}
		])
		.directive('todo', [
			function(){
				return {
					restrict: 'E',
					templateUrl: 'partials/todo.html'
				}
			}
		])
})();