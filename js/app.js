(function (window) {
	Vue.directive('focus', {
		inserted (el) {
			el.focus()
		}
	})
	Vue.directive('todo-focus', {
		update (el, binding) {
			el.focus()

		}
	})
	const todos = [
				{
					id: 1,
					title: '吃饭',
					completed: true
				},
				{
					id: 2,
					title: '学习',
					completed: false
				},
				{
					id: 3,
					title: '找实习',
					completed: true
				}
			]

			window.app = new Vue({
				el: '#app',
				data: {
					todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
					currentEditing: null,
					filterText: 'all'

				},
				methods: {
					handleNewTodo (e) {
						const target = e.target
						const value = target.value
						if (!value.length) {
							return 
						}
						const todos = this.todos
						todos.push({
							id: todos.length ? todos[todos.length - 1].id + 1 : 1,
							title: value,
							completed: false
						})
						target.value = ""

					},
					handleToggleAllChange (e) {
						const checked = e.target.checked
						this.todos.forEach(item => {
							item.completed = checked
						})
					},
					handleRemoveTodoclick (index) {
						this.todos.splice(index, 1)
					},
					handleGetEditingDblclick (todo) {
						this.currentEditing = todo
					},
					handleSaveEditKeydown (todo, index, e) {
						const target = e.target
						const value = target.value
						if (!value.length) {
							this.todos.splice(index, 1)
						} else {
							todo.title = value
							this.currentEditing = null
						}
					},
					handleCancelEditEsc () {
						this.currentEditing = null
					},
					
					handleClearAllDoneClick () {
						for (let i = 0; i < this.todos.length; i++) {
							if (this.todos[i].completed) {
								this.todos.splice(i, 1)
								i--
							}
						}
					}
				},
				computed: {
					remaningCount () {
						return this.todos.filter(t => !t.completed).length
					},
					toggleAllStat: {
						get () {
							return this.todos.every(t => t.completed)
						},
						set () {
							const checked = !this.toggleAllStat
							this.todos.forEach(t => {t.completed = checked})
						}
					},


					filterTodos () {
						switch(this.filterText) {
							case 'active' :
								return this.todos.filter(t => !t.completed)
								break
							case 'completed' :
								return this.todos.filter(t => t.completed)
								break
							default:
								return this.todos
								break
						}
					}

					
				},
				watch: {
					todos: {
						handler () {
							window.localStorage.setItem('todos', JSON.stringify(this.todos))
						},
						deep: true
					}
				}
			})
			handlehashChange()

			window.onhashchange = handlehashChange

			function handlehashChange () {
				app.filterText = window.location.hash.substr(2)
				
		}
})(window);
