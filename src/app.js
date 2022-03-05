import state from './state';
import view from './view';

export default class TodoApp {
    constructor() {
        this.state = state;
        this.view = view;
    }

    init() {
        this.state.init();
        this.view.init();
        this.view.renderNavigation({
            projects: this.state.projects,
            handler: this.navigationActions.bind(this)
        });
        this.view.renderCombinePage({
            projects: this.state.todayProjects,
            title: this.view.dom.navListItems[0].dataset.page,
            handler: this.combinedPageActions.bind(this)
        });
        this.view.setActiveClassMenuItem(this.view.dom.navListItems[0]);
    }

    navigationActions({target: el}) {
        if (el.dataset?.page) {
            this.view.setActiveClassMenuItem(el);  
            if (el.dataset.page.match(/project-\d/g)) {
                this.view.renderTodosPage({
                    project: this.state.projects[el.dataset.projectIndex],
                    projectIndex: el.dataset.projectIndex,
                    handler: this.todosPageActions.bind(this),
                    todoHandler: this.todoActions.bind(this)
                });
            } else if (el.dataset.page === 'add-project') {
                this.view.renderAddEditProjectModal({
                    handler: this.projectModalActions.bind(this)
                });
            } else {
                this.view.renderCombinePage({
                    projects: el.dataset.page === 'today'
                        ? this.state.todayProjects
                        : this.state.thisWeekProjects,
                    title: el.dataset.page,
                    handler: this.combinedPageActions.bind(this)
                });
            }
        }      
    }

    projectModalActions({target: el}) {
        if (el.dataset?.modalAction === 'close') {
            this.view.closeModal(this.view.dom.projectModal);
        }
        
        if (el.dataset?.modalAction === 'add' || el.dataset?.modalAction === 'edit') {
            const checkInput = this.view.dom.projectModalForm[0].reportValidity();
            const [{value: title}, {value: description}] = this.view.dom.projectModalForm;
            const dateCreated = new Date();
            let projectIndex = el.dataset?.projectIndex;

            if (!checkInput) {
                return;
            }

            if (el.dataset?.modalAction === 'add' && this.state.hasProject(title)) {
                this.view.renderModalErrorMessage(['A project with that name already exists.']);
                return;
            }

            if (el.dataset?.modalAction === 'add') {
                this.state.addProject({title, description, dateCreated, todos: []});
                projectIndex = this.state.projects.length - 1;
            } else {
                this.state.updateProject(projectIndex, {title, description});
            }

            this.view.closeModal(this.view.dom.projectModal);
            this.view.renderNavigation({projects: this.state.projects});
            this.view.renderTodosPage({
                project: this.state.projects[projectIndex],
                projectIndex,
                handler: this.todosPageActions.bind(this),
                todoHandler: this.todoActions.bind(this)
            });
            this.view.setActiveClassMenuItem(
                this.view.dom.projectListItems[projectIndex]
            );
        } 
    }

    todosPageActions({target: el}, project = null, projectIndex = null) {
        if (el.dataset?.todosActions) {
            if (el.dataset?.todosActions === 'edit') {
                this.view.renderAddEditProjectModal({
                    project,
                    projectIndex,
                    handler: this.projectModalActions.bind(this)
                });
            } else {
                const result = confirm(`Are you sure you want to delete ${project.title}?`);
                if (result) {
                    this.state.deleteProject(projectIndex);

                    projectIndex = projectIndex === 0 && this.state.projects.length
                        ? 0
                        : projectIndex - 1;
                    
                    this.view.renderNavigation({projects: this.state.projects});
                    
                    if (this.state.projects.length) {
                        this.view.renderTodosPage({
                            project: this.state.projects[projectIndex],
                            projectIndex: projectIndex,
                            handler: this.todosPageActions.bind(this),
                            todoHandler: this.todoActions.bind(this)
                        });
                        this.view.setActiveClassMenuItem(
                            this.view.dom.projectListItems[projectIndex]
                        );
                    } else {
                        this.view.renderCombinePage({
                            projects: this.state.todayProjects,
                            title: this.view.dom.navListItems[0].dataset.page,
                            handler: this.combinedPageActions.bind(this)
                        });
                        this.view.setActiveClassMenuItem(this.view.dom.navListItems[0]);
                    }
                }
            }
        }
    }

    todoActions({target: el}, project = null, projectIndex = null) {
        const validInteraction = el.type === 'checkbox' || el.dataset?.todoAction;
        if(validInteraction) {
            if (el.type === 'checkbox') {
                this.state.markTodoAsDone(el.dataset.projectIndex, el.dataset.todoIndex, el.checked);
            }
            if (el.dataset.todoAction === 'delete') {
                this.state.deleteTodo(el.dataset.projectIndex, el.dataset.todoIndex);
            }
            if (el.dataset.todoAction === 'add') {
                this.view.renderAddEditTodoModal({
                    project,
                    projectIndex,
                    handler: this.projectModalTodoActions.bind(this)
                });
                return;
            }
            if (el.dataset.todoAction === 'edit') {
                this.view.renderAddEditTodoModal({
                    project,
                    projectIndex,
                    todoIndex: el.dataset.todoIndex,
                    handler: this.projectModalTodoActions.bind(this)
                });
                return;
            }
            this.view.renderTodosPage({
                project: this.state.projects[projectIndex],
                projectIndex: projectIndex,
                handler: this.todosPageActions.bind(this),
                todoHandler: this.todoActions.bind(this)
            });
        }
    }

    projectModalTodoActions({target: el}) {        
        if (el.dataset?.modalAction === 'close') {
            this.view.closeModal(this.view.dom.todoModal);
        }

        if (el.dataset?.modalAction === 'add' || el.dataset?.modalAction === 'edit') {
            const checkInput = this.view.dom.todoModalForm[0].reportValidity();
            const [{value: title}, {value: date}, {value: priority}] = this.view.dom.todoModalForm;
            let projectIndex = el.dataset?.projectIndex;
            let todoIndex = el.dataset?.todoIndex;

            if (!checkInput) {
                return;
            }

            function inputDateToDate(date) {
                const [year, month, day] = date.split('-').map(Number);
                return new Date(
                    year,
                    month - 1,
                    day,
                    new Date().getHours(),
                    new Date().getMinutes(),
                    new Date().getSeconds(),
                )
            }

            if (el.dataset?.modalAction === 'add') {
                this.state.addTodo(projectIndex, {
                    completed: false,
                    title, 
                    dueDate: inputDateToDate(date),
                    priority,
                });
            } else {
                this.state.updateTodo(projectIndex, todoIndex, {
                    title, 
                    dueDate: inputDateToDate(date),
                    priority,
                })
            }

            this.view.closeModal(this.view.dom.todoModal);
            this.view.renderTodosPage({
                project: this.state.projects[projectIndex],
                projectIndex,
                handler: this.todosPageActions.bind(this),
                todoHandler: this.todoActions.bind(this)
            });
        } 
    }

    combinedPageActions({target: el}) {
        const projectTitle = el.closest('.project-combined').dataset.projectTitle;
        const projectIndex = this.state.getProjectIndexByTitle(projectTitle);
        this.view.renderTodosPage({
            project: this.state.projects[projectIndex],
            projectIndex,
            handler: this.todosPageActions.bind(this),
            todoHandler: this.todoActions.bind(this)
        });
        this.view.setActiveClassMenuItem(
            this.view.dom.projectListItems[projectIndex]
        );
    }
} 
