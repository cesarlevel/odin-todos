import { isToday, isThisWeek } from 'date-fns'

class TodoState {
    constructor() {
        this.projects = [];
    }

    static demoData = [
        {
            title: 'Project demo',
            description: 'This project serves as a demo, when no data is available on localStorage',
            dateCreated: new Date(),
            todos: [
                {
                    completed: false,
                    title: 'My first thing todo',
                    dueDate: new Date(),
                    priority: 'high'
                },
                {
                    completed: true,
                    title: 'This task is done!',
                    dueDate: new Date(),
                    priority: 'medium'
                },
                {
                    completed: true,
                    title: 'This task is also done!',
                    dueDate: new Date(),
                    priority: 'low'
                }
            ]
        }
    ];

    static odinTodoLocalStorageLabel = 'odin-todo';

    get todayProjects() {
        return [...this.projects].map(project => {
            return {
                ...project,
                todos: project.todos.filter(({dueDate}) => isToday(dueDate)),
            };
        }).filter(project => project.todos.length);
    }

    get thisWeekProjects() {
        return [...this.projects].map(project => {
            return {
                ...project,
                todos: project.todos.filter(({dueDate}) => isThisWeek(dueDate, { weekStartsOn: 1 }))
            };
        }).filter(project => project.todos.length);
    }

    init() {
        const localData = localStorage.getItem(TodoState.odinTodoLocalStorageLabel);
        if (localData) {
            this.projects = JSON.parse(localData);
            this.updateProjectsTimeData();
        } else {
            this.projects = TodoState.demoData;
        }
    }

    updateProjectsTimeData() {
        this.projects.forEach(project => {
            project.dateCreated = new Date(project.dateCreated);
            if (project?.todos.length) {
                project.todos.forEach(todo => {
                    todo.dueDate = new Date(todo.dueDate);
                })
            }
        })
        console.log(this.projects)
    }

    setData() {
        const data = JSON.stringify(this.projects);
        localStorage.setItem(TodoState.odinTodoLocalStorageLabel, data);
    }

    addProject(project) {
        this.projects.push(project);
        this.setData();
    }

    updateProject(projectToUpdateIndex, payload) {
        this.projects[projectToUpdateIndex] = {
            ...this.projects[projectToUpdateIndex],
            title: payload.title,
            description: payload.description
        };
        this.setData();
    }

    deleteProject(projectIndex) {
        this.projects.splice(projectIndex, 1);
        this.setData();
    }

    markTodoAsDone(projectIndex, todoIndex, undo) {
        this.projects[projectIndex].todos[todoIndex].completed = undo;
        this.setData();
    }

    addTodo(projectIndex, todo) {
        this.projects[projectIndex].todos.push(todo);
        this.setData();
    }

    updateTodo(projectIndex, todoIndex, todo) {
        this.projects[projectIndex].todos[todoIndex] = {
            ...this.projects[projectIndex].todos[todoIndex],
            ...todo
        }
        this.setData();
    }

    deleteTodo(projectIndex, todoIndex) {
        this.projects[projectIndex].todos.splice(todoIndex, 1);
        this.setData();
    }

    hasProject(title) {
        return this.projects.some(project => project.title === title);
    }

    getProjectIndexByTitle(title) {
        return this.projects.findIndex(project => project.title === title);
    }
}

export default new TodoState();