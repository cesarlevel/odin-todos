import { formatDistance, format } from 'date-fns'

class TodoView {
    constructor() {
        this.dom = {
            app: document.querySelector('#app'),
        };
    }

    init() {  
        this.dom.nav = document.querySelector('nav'); 
        this.dom.pageContainer = document.querySelector('article');
    }

    humanRedableTime(time) {
        return formatDistance(time, new Date(), { addSuffix: true })
    }

    formatToDateInput(time) {
        const [month, date, year] = time.toLocaleDateString().split('/');
        return `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`;
    }

    renderNavigation({projects = null, handler = null}) {
        this.dom.nav.innerHTML = `
            <ul class="nav-main-list">
                <li data-page="today" class="nav-main-list-item"><i data-page="today" class="uil uil-calender"></i>Today</li>
                <li data-page="this-week" class="nav-main-list-item"><i data-page="this-week" class="uil uil-schedule"></i>This week</li>
            </ul>
            <span class="nav-item-title">Projects</span>
            <ul class="nav-project-list">
                ${projects.map((project, i) => `
                    <li data-page="project-${i}" data-project-index="${i}" class="nav-project-list-item">
                        <i data-page="project-${i}" data-project-index="${i}" class="uil uil-circle"></i>
                        ${project.title}
                    </li>
                `).join('')}
            </ul>
            <a data-page="add-project"><i data-page="add-project" class="uil uil-plus"></i>Add project</a>
        `;
        this.dom.navListItems = document.querySelectorAll('.nav-main-list li');
        this.dom.projectListItems = document.querySelectorAll('.nav-project-list li');
        this.dom.addProject = document.querySelector('nav a');
        if (handler) {
            this.dom.nav.addEventListener('click', handler);
        }
    }

    setActiveClassMenuItem(el) {
        if (el.dataset?.page !== 'add-project') {
            [
                ...this.dom.navListItems,
                ...this.dom.projectListItems
            ].forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === el.dataset.page) {
                    item.classList.add('active');
                }
            });
        }
    }

    renderAddEditProjectModal({project = null, projectIndex = null, handler = null}) {
        const isNew = !project;
        const modalTitle = isNew ? 'Add Project' : 'Edit Project';
        const isModalPresent = document.querySelector('#project-modal');
        const titleValue = isNew ? '' : project.title;
        const descriptionValue = isNew ? '' : project.description;
        const modalActions = `
            <button type="button" data-modal-action="close" class="btn btn-secondary">Cancel</button>
            ${isNew
                ? `<button type="button" data-modal-action="add" class="btn">Add</button>`
                : `<button type="button" data-modal-action="edit" data-project-index="${projectIndex}" class="btn">Edit</button>`
            }
        `;

        if (!isModalPresent) {
            this.dom.app.insertAdjacentHTML('beforeend', `
                <div class="modal" id="project-modal">
                    <div class="modal-container">
                        <h2 class="modal-container-title">${modalTitle}</h2>
                        <div class="modal-errors"></div>
                        <form action="javascript:void(0);">
                            <label>Project Title</label>
                            <input required type="text" value="${titleValue}"/>
                            <label>Project Description</label>
                            <textarea rows="3">${descriptionValue}</textarea>
                            <div class="modal-container-actions">
                                ${modalActions}
                            </div>
                        </form>
                    </div>
                </div>
            `);
            this.dom.projectModal = document.querySelector('#project-modal');
            this.dom.projectModalForm = document.querySelector('#project-modal form');
            this.dom.projectModalErrors = document.querySelector('#project-modal .modal-errors');
            this.dom.projectModalActions = document.querySelector('#project-modal .modal-container-actions');
            this.showModal(this.dom.projectModal);
            this.dom.projectModal.addEventListener('click', handler);
        } else {
            this.showModal(this.dom.projectModal);
            const [title, description] = this.dom.projectModalForm
            title.value = titleValue;
            description.value = descriptionValue;

            this.dom.projectModal.querySelector('h2').innerText = modalTitle;
            this.dom.projectModalActions.innerHTML = modalActions;
        }
    }

    renderModalErrorMessage(errors) {
        this.dom.projectModalErrors.classList.add('is-visible');
        this.dom.projectModalErrors.innerHTML = `
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
    }

    showModal(modal) {
        modal.classList.add('is-visible');
    }

    closeModal(modal) {
        modal.classList.remove('is-visible');
        modal.querySelector('.modal-errors').classList.remove('is-visible');
        modal.querySelector('form').reset();
    }

    renderCombinePage({projects, title, handler}) {
        this.dom.pageContainer.innerHTML = `
            <div class="title title-combined">
                <h1>${title.replace(/-/g, ' ')}</h1>
            </div>

            ${
                projects.length
                    ? projects.map(project => {
                        return `
                            <div class="project-combined" data-project-title="${project.title}">
                                <h2>${project.title}</h2><i class="uil uil-arrow-right"></i>
                                <div class="todos">
                                    <ul class="todo-list is-relaxed">
                                    ${project.todos.map((todo, i) => `
                                        <li class="todo-list-item ${todo.completed ? 'is-checked' : ''}">
                                            <div class="todo-list-item-priority is-${todo.priority}"></div>
                                            <p class="todo-list-item-title">${todo.title}</p>
                                        </li>
                                    `).join('')}
                                    </ul>
                                </div>
                            </div>
                        `
                    }).join('')
                    : `<p>All done for ${title.replace(/-/g, ' ')}!</p>`
            }
        `;

        if (projects.length) {
            this.dom.pageContainer.querySelectorAll('.project-combined')
                .forEach(project => project.addEventListener('click', handler, true));
        }
    }

    renderTodosPage({project, projectIndex, handler, todoHandler}) {
        this.dom.pageContainer.innerHTML = `
        <div class="title">
            <h1>${project.title}</h1>
            <div class="title-actions">
                <button data-project-index="${projectIndex}" data-todos-actions="delete" class="btn btn-secondary btn-danger btn-icon">
                    <i data-todos-actions="delete" data-project-index="${projectIndex}" class="uil uil-trash-alt"></i>
                </button>
                <button data-project-index="${projectIndex}" data-todos-actions="edit" class="btn">Edit</button>
            </div>
        </div>
        <p class="project-description">${project.description}</p>
        <p class="project-date-created">Created ${this.humanRedableTime(project.dateCreated)}</p>
        <div class="todos">
            <ul class="todos-list">
            ${
                project.todos.length
                    ? `
                        ${project.todos.map((todo, i) => `
                            <li class="todo-list-item ${todo.completed ? 'is-checked' : ''}">
                                <div class="todo-list-item-priority is-${todo.priority}"></div>
                                <input data-project-index="${projectIndex}" data-todo-index="${i}" type="checkbox" ${todo.completed ? 'checked' : ''}/>
                                <p class="todo-list-item-title">${todo.title}</p>
                                <p class="todo-list-item-date">Due to ${format(todo.dueDate, 'MM/dd/yyyy')}</p>
                                <div class="todo-list-item-actions">
                                <i data-project-index="${projectIndex}" data-todo-index="${i}" data-todo-action="edit" class="edit uil uil-pen"></i>
                                <i data-project-index="${projectIndex}" data-todo-index="${i}" data-todo-action="delete" class="delete uil uil-trash-alt"></i>
                                </div>
                            </li>
                        `).join('')}
                    `
                    : `<span class="faint-color">Start adding your todos now!</span>`
            }
            </ul>
            <a class="add-todo" data-todo-action="add"><i data-page="add-todo" class="uil uil-plus"></i>Add task</a>
        </div>
        `;
        this.dom.pageContainer.querySelector('.title').addEventListener('click', (e) => handler(e, project, projectIndex));
        this.dom.pageContainer.querySelector('.todos').addEventListener('click', (e) => todoHandler(e, project, projectIndex));
    }

    renderAddEditTodoModal({project = null, projectIndex = null, todoIndex = null, handler = null}) {
        const isNew = !todoIndex;
        const modalTitle = isNew ? 'Add Todo' : 'Edit Todo';
        const isModalPresent = document.querySelector('#todo-modal');
        const titleValue = isNew ? '' : project.todos[todoIndex].title;
        const dueDateValue = isNew
            ? this.formatToDateInput(new Date())
            : this.formatToDateInput(project.todos[todoIndex].dueDate);
        const modalActions = `
            <button type="button" data-modal-action="close" class="btn btn-secondary">Cancel</button>
            ${isNew
                ? `<button type="button" data-modal-action="add" data-project-index="${projectIndex}" class="btn">Add</button>`
                : `<button type="button" data-modal-action="edit" data-todo-index="${todoIndex}" data-project-index="${projectIndex}" class="btn">Edit</button>`
            }
        `;

        if (!isModalPresent) {
            this.dom.app.insertAdjacentHTML('beforeend', `
                <div class="modal" id="todo-modal">
                    <div class="modal-container">
                        <h2 class="modal-container-title">${modalTitle}</h2>
                        <div class="modal-errors"></div>
                        <form action="javascript:void(0);">
                            <label>Todo Title</label>
                            <input required type="text" value="${titleValue}"/>
                            <label>Due Date</label>
                            <input required type="date" value="${dueDateValue}"/>
                            <label>Priority</label>
                            <div class="select-field">
                                <span class="select-arrow"></span>
                                <select>
                                    <option value="medium">Medium</option>
                                    <option value="low">low</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div class="modal-container-actions">
                                ${modalActions}
                            </div>
                        </form>
                    </div>
                </div>
            `);
            this.dom.todoModal = document.querySelector('#todo-modal');
            this.dom.todoModalForm = document.querySelector('#todo-modal form');
            this.dom.todoModalErrors = document.querySelector('#todo-modal .modal-errors');
            this.dom.todoModalActions = document.querySelector('#todo-modal .modal-container-actions');
            this.showModal(this.dom.todoModal);
            this.dom.todoModal.addEventListener('click', handler);
        } else {
            this.showModal(this.dom.todoModal);
            const [title, dueDate] = this.dom.todoModalForm;
            title.value = titleValue;
            dueDate.value = dueDateValue;

            this.dom.todoModal.querySelector('h2').innerText = modalTitle;
            this.dom.todoModalActions.innerHTML = modalActions;
        }
    }
}

export default new TodoView();