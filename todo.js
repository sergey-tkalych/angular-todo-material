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

				function save(){
					localStorage.setItem('todoList', JSON.stringify(list));
				}

				return {
					getList: getList,
					add: add,
					done: save
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

				this.doneTodo = ToDo.done;

				function defaultToDo(){
					return {text: ''};
				}
			}
		]);
})();