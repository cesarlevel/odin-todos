var $=Object.defineProperty,D=Object.defineProperties;var L=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var g=(d,t,e)=>t in d?$(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e,u=(d,t)=>{for(var e in t||(t={}))S.call(t,e)&&g(d,e,t[e]);if(w)for(var e of w(t))q.call(t,e)&&g(d,e,t[e]);return d},v=(d,t)=>D(d,L(t));var b=(d,t,e)=>(g(d,typeof t!="symbol"?t+"":t,e),e);import{i as E,a as k,f as C,b as I}from"./vendor.71e5df89.js";const x=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}};x();const p=class{constructor(){this.projects=[]}get todayProjects(){return[...this.projects].map(t=>v(u({},t),{todos:t.todos.filter(({dueDate:e})=>E(e))})).filter(t=>t.todos.length)}get thisWeekProjects(){return[...this.projects].map(t=>v(u({},t),{todos:t.todos.filter(({dueDate:e})=>k(e,{weekStartsOn:1}))})).filter(t=>t.todos.length)}init(){const t=localStorage.getItem(p.odinTodoLocalStorageLabel);t?(this.projects=JSON.parse(t),this.updateProjectsTimeData()):this.projects=p.demoData}updateProjectsTimeData(){this.projects.forEach(t=>{t.dateCreated=new Date(t.dateCreated),(t==null?void 0:t.todos.length)&&t.todos.forEach(e=>{e.dueDate=new Date(e.dueDate)})})}setData(){const t=JSON.stringify(this.projects);localStorage.setItem(p.odinTodoLocalStorageLabel,t)}addProject(t){this.projects.push(t),this.setData()}updateProject(t,e){this.projects[t]=v(u({},this.projects[t]),{title:e.title,description:e.description}),this.setData()}deleteProject(t){this.projects.splice(t,1),this.setData()}markTodoAsDone(t,e,o){this.projects[t].todos[e].completed=o,this.setData()}addTodo(t,e){this.projects[t].todos.push(e),this.setData()}updateTodo(t,e,o){this.projects[t].todos[e]=u(u({},this.projects[t].todos[e]),o),this.setData()}deleteTodo(t,e){this.projects[t].todos.splice(e,1),this.setData()}hasProject(t){return this.projects.some(e=>e.title===t)}getProjectIndexByTitle(t){return this.projects.findIndex(e=>e.title===t)}};let j=p;b(j,"demoData",[{title:"Project demo",description:"This project serves as a demo, when no data is available on localStorage",dateCreated:new Date,todos:[{completed:!1,title:"My first thing todo",dueDate:new Date,priority:"high"},{completed:!0,title:"This task is done!",dueDate:new Date,priority:"medium"},{completed:!0,title:"This task is also done!",dueDate:new Date,priority:"low"}]}]),b(j,"odinTodoLocalStorageLabel","odin-todo");var H=new j;class N{constructor(){this.dom={app:document.querySelector("#app")}}init(){this.dom.nav=document.querySelector("nav"),this.dom.pageContainer=document.querySelector("article")}humanRedableTime(t){return C(t,new Date,{addSuffix:!0})}formatToDateInput(t){const[e,o,i]=t.toLocaleDateString().split("/");return`${i}-${e.padStart(2,"0")}-${o.padStart(2,"0")}`}renderNavigation({projects:t=null,handler:e=null}){this.dom.nav.innerHTML=`
            <ul class="nav-main-list">
                <li data-page="today" class="nav-main-list-item"><i data-page="today" class="uil uil-calender"></i>Today</li>
                <li data-page="this-week" class="nav-main-list-item"><i data-page="this-week" class="uil uil-schedule"></i>This week</li>
            </ul>
            <span class="nav-item-title">Projects</span>
            <ul class="nav-project-list">
                ${t.map((o,i)=>`
                    <li data-page="project-${i}" data-project-index="${i}" class="nav-project-list-item">
                        <i data-page="project-${i}" data-project-index="${i}" class="uil uil-circle"></i>
                        ${o.title}
                    </li>
                `).join("")}
            </ul>
            <a data-page="add-project"><i data-page="add-project" class="uil uil-plus"></i>Add project</a>
        `,this.dom.navListItems=document.querySelectorAll(".nav-main-list li"),this.dom.projectListItems=document.querySelectorAll(".nav-project-list li"),this.dom.addProject=document.querySelector("nav a"),e&&this.dom.nav.addEventListener("click",e)}setActiveClassMenuItem(t){var e;((e=t.dataset)==null?void 0:e.page)!=="add-project"&&[...this.dom.navListItems,...this.dom.projectListItems].forEach(o=>{o.classList.remove("active"),o.dataset.page===t.dataset.page&&o.classList.add("active")})}renderAddEditProjectModal({project:t=null,projectIndex:e=null,handler:o=null}){const i=!t,s=i?"Add Project":"Edit Project",a=document.querySelector("#project-modal"),l=i?"":t.title,h=i?"":t.description,n=`
            <button type="button" data-modal-action="close" class="btn btn-secondary">Cancel</button>
            ${i?'<button type="button" data-modal-action="add" class="btn">Add</button>':`<button type="button" data-modal-action="edit" data-project-index="${e}" class="btn">Edit</button>`}
        `;if(!a)this.dom.app.insertAdjacentHTML("beforeend",`
                <div class="modal" id="project-modal">
                    <div class="modal-container">
                        <h2 class="modal-container-title">${s}</h2>
                        <div class="modal-errors"></div>
                        <form action="javascript:void(0);">
                            <label>Project Title</label>
                            <input required type="text" value="${l}"/>
                            <label>Project Description</label>
                            <textarea rows="3">${h}</textarea>
                            <div class="modal-container-actions">
                                ${n}
                            </div>
                        </form>
                    </div>
                </div>
            `),this.dom.projectModal=document.querySelector("#project-modal"),this.dom.projectModalForm=document.querySelector("#project-modal form"),this.dom.projectModalErrors=document.querySelector("#project-modal .modal-errors"),this.dom.projectModalActions=document.querySelector("#project-modal .modal-container-actions"),this.showModal(this.dom.projectModal),this.dom.projectModal.addEventListener("click",o);else{this.showModal(this.dom.projectModal);const[c,m]=this.dom.projectModalForm;c.value=l,m.value=h,this.dom.projectModal.querySelector("h2").innerText=s,this.dom.projectModalActions.innerHTML=n}}renderModalErrorMessage(t){this.dom.projectModalErrors.classList.add("is-visible"),this.dom.projectModalErrors.innerHTML=`
            <ul>
                ${t.map(e=>`<li>${e}</li>`).join("")}
            </ul>
        `}showModal(t){t.classList.add("is-visible")}closeModal(t){t.classList.remove("is-visible"),t.querySelector(".modal-errors").classList.remove("is-visible"),t.querySelector("form").reset()}renderCombinePage({projects:t,title:e,handler:o}){this.dom.pageContainer.innerHTML=`
            <div class="title title-combined">
                <h1>${e.replace(/-/g," ")}</h1>
            </div>

            ${t.length?t.map(i=>`
                            <div class="project-combined" data-project-title="${i.title}">
                                <h2>${i.title}</h2><i class="uil uil-arrow-right"></i>
                                <div class="todos">
                                    <ul class="todo-list is-relaxed">
                                    ${i.todos.map((s,a)=>`
                                        <li class="todo-list-item ${s.completed?"is-checked":""}">
                                            <div class="todo-list-item-priority is-${s.priority}"></div>
                                            <p class="todo-list-item-title">${s.title}</p>
                                        </li>
                                    `).join("")}
                                    </ul>
                                </div>
                            </div>
                        `).join(""):`<p>All done for ${e.replace(/-/g," ")}!</p>`}
        `,t.length&&this.dom.pageContainer.querySelectorAll(".project-combined").forEach(i=>i.addEventListener("click",o,!0))}renderTodosPage({project:t,projectIndex:e,handler:o,todoHandler:i}){this.dom.pageContainer.innerHTML=`
        <div class="title">
            <h1>${t.title}</h1>
            <div class="title-actions">
                <button data-project-index="${e}" data-todos-actions="delete" class="btn btn-secondary btn-danger btn-icon">
                    <i data-todos-actions="delete" data-project-index="${e}" class="uil uil-trash-alt"></i>
                </button>
                <button data-project-index="${e}" data-todos-actions="edit" class="btn">Edit</button>
            </div>
        </div>
        <p class="project-description">${t.description}</p>
        <p class="project-date-created">Created ${this.humanRedableTime(t.dateCreated)}</p>
        <div class="todos">
            <ul class="todos-list">
            ${t.todos.length?`
                        ${t.todos.map((s,a)=>`
                            <li class="todo-list-item ${s.completed?"is-checked":""}">
                                <div class="todo-list-item-priority is-${s.priority}"></div>
                                <input data-project-index="${e}" data-todo-index="${a}" type="checkbox" ${s.completed?"checked":""}/>
                                <p class="todo-list-item-title">${s.title}</p>
                                <p class="todo-list-item-date">Due to ${I(s.dueDate,"MM/dd/yyyy")}</p>
                                <div class="todo-list-item-actions">
                                <i data-project-index="${e}" data-todo-index="${a}" data-todo-action="edit" class="edit uil uil-pen"></i>
                                <i data-project-index="${e}" data-todo-index="${a}" data-todo-action="delete" class="delete uil uil-trash-alt"></i>
                                </div>
                            </li>
                        `).join("")}
                    `:'<span class="faint-color">Start adding your todos now!</span>'}
            </ul>
            <a class="add-todo" data-todo-action="add"><i data-page="add-todo" class="uil uil-plus"></i>Add task</a>
        </div>
        `,this.dom.pageContainer.querySelector(".title").addEventListener("click",s=>o(s,t,e)),this.dom.pageContainer.querySelector(".todos").addEventListener("click",s=>i(s,t,e))}renderAddEditTodoModal({project:t=null,projectIndex:e=null,todoIndex:o=null,handler:i=null}){const s=!o,a=s?"Add Todo":"Edit Todo",l=document.querySelector("#todo-modal"),h=s?"":t.todos[o].title,n=s?this.formatToDateInput(new Date):this.formatToDateInput(t.todos[o].dueDate),c=`
            <button type="button" data-modal-action="close" class="btn btn-secondary">Cancel</button>
            ${s?`<button type="button" data-modal-action="add" data-project-index="${e}" class="btn">Add</button>`:`<button type="button" data-modal-action="edit" data-todo-index="${o}" data-project-index="${e}" class="btn">Edit</button>`}
        `;if(!l)this.dom.app.insertAdjacentHTML("beforeend",`
                <div class="modal" id="todo-modal">
                    <div class="modal-container">
                        <h2 class="modal-container-title">${a}</h2>
                        <div class="modal-errors"></div>
                        <form action="javascript:void(0);">
                            <label>Todo Title</label>
                            <input required type="text" value="${h}"/>
                            <label>Due Date</label>
                            <input required type="date" value="${n}"/>
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
                                ${c}
                            </div>
                        </form>
                    </div>
                </div>
            `),this.dom.todoModal=document.querySelector("#todo-modal"),this.dom.todoModalForm=document.querySelector("#todo-modal form"),this.dom.todoModalErrors=document.querySelector("#todo-modal .modal-errors"),this.dom.todoModalActions=document.querySelector("#todo-modal .modal-container-actions"),this.showModal(this.dom.todoModal),this.dom.todoModal.addEventListener("click",i);else{this.showModal(this.dom.todoModal);const[m,r]=this.dom.todoModalForm;m.value=h,r.value=n,this.dom.todoModal.querySelector("h2").innerText=a,this.dom.todoModalActions.innerHTML=c}}}var F=new N;class O{constructor(){this.state=H,this.view=F}init(){this.state.init(),this.view.init(),this.view.renderNavigation({projects:this.state.projects,handler:this.navigationActions.bind(this)}),this.view.renderCombinePage({projects:this.state.todayProjects,title:this.view.dom.navListItems[0].dataset.page,handler:this.combinedPageActions.bind(this)}),this.view.setActiveClassMenuItem(this.view.dom.navListItems[0])}navigationActions({target:t}){var e;((e=t.dataset)==null?void 0:e.page)&&(this.view.setActiveClassMenuItem(t),t.dataset.page.match(/project-\d/g)?this.view.renderTodosPage({project:this.state.projects[t.dataset.projectIndex],projectIndex:t.dataset.projectIndex,handler:this.todosPageActions.bind(this),todoHandler:this.todoActions.bind(this)}):t.dataset.page==="add-project"?this.view.renderAddEditProjectModal({handler:this.projectModalActions.bind(this)}):this.view.renderCombinePage({projects:t.dataset.page==="today"?this.state.todayProjects:this.state.thisWeekProjects,title:t.dataset.page,handler:this.combinedPageActions.bind(this)}))}projectModalActions({target:t}){var e,o,i,s,a,l;if(((e=t.dataset)==null?void 0:e.modalAction)==="close"&&this.view.closeModal(this.view.dom.projectModal),((o=t.dataset)==null?void 0:o.modalAction)==="add"||((i=t.dataset)==null?void 0:i.modalAction)==="edit"){const h=this.view.dom.projectModalForm[0].reportValidity(),[{value:n},{value:c}]=this.view.dom.projectModalForm,m=new Date;let r=(s=t.dataset)==null?void 0:s.projectIndex;if(!h)return;if(((a=t.dataset)==null?void 0:a.modalAction)==="add"&&this.state.hasProject(n)){this.view.renderModalErrorMessage(["A project with that name already exists."]);return}((l=t.dataset)==null?void 0:l.modalAction)==="add"?(this.state.addProject({title:n,description:c,dateCreated:m,todos:[]}),r=this.state.projects.length-1):this.state.updateProject(r,{title:n,description:c}),this.view.closeModal(this.view.dom.projectModal),this.view.renderNavigation({projects:this.state.projects}),this.view.renderTodosPage({project:this.state.projects[r],projectIndex:r,handler:this.todosPageActions.bind(this),todoHandler:this.todoActions.bind(this)}),this.view.setActiveClassMenuItem(this.view.dom.projectListItems[r])}}todosPageActions({target:t},e=null,o=null){var i,s;((i=t.dataset)==null?void 0:i.todosActions)&&(((s=t.dataset)==null?void 0:s.todosActions)==="edit"?this.view.renderAddEditProjectModal({project:e,projectIndex:o,handler:this.projectModalActions.bind(this)}):confirm(`Are you sure you want to delete ${e.title}?`)&&(this.state.deleteProject(o),o=o===0&&this.state.projects.length?0:o-1,this.view.renderNavigation({projects:this.state.projects}),this.state.projects.length?(this.view.renderTodosPage({project:this.state.projects[o],projectIndex:o,handler:this.todosPageActions.bind(this),todoHandler:this.todoActions.bind(this)}),this.view.setActiveClassMenuItem(this.view.dom.projectListItems[o])):(this.view.renderCombinePage({projects:this.state.todayProjects,title:this.view.dom.navListItems[0].dataset.page,handler:this.combinedPageActions.bind(this)}),this.view.setActiveClassMenuItem(this.view.dom.navListItems[0]))))}todoActions({target:t},e=null,o=null){var s;if(t.type==="checkbox"||((s=t.dataset)==null?void 0:s.todoAction)){if(t.type==="checkbox"&&this.state.markTodoAsDone(t.dataset.projectIndex,t.dataset.todoIndex,t.checked),t.dataset.todoAction==="delete"&&this.state.deleteTodo(t.dataset.projectIndex,t.dataset.todoIndex),t.dataset.todoAction==="add"){this.view.renderAddEditTodoModal({project:e,projectIndex:o,handler:this.projectModalTodoActions.bind(this)});return}if(t.dataset.todoAction==="edit"){this.view.renderAddEditTodoModal({project:e,projectIndex:o,todoIndex:t.dataset.todoIndex,handler:this.projectModalTodoActions.bind(this)});return}this.view.renderTodosPage({project:this.state.projects[o],projectIndex:o,handler:this.todosPageActions.bind(this),todoHandler:this.todoActions.bind(this)})}}projectModalTodoActions({target:t}){var e,o,i,s,a,l;if(((e=t.dataset)==null?void 0:e.modalAction)==="close"&&this.view.closeModal(this.view.dom.todoModal),((o=t.dataset)==null?void 0:o.modalAction)==="add"||((i=t.dataset)==null?void 0:i.modalAction)==="edit"){let f=function(M){const[A,T,P]=M.split("-").map(Number);return new Date(A,T-1,P,new Date().getHours(),new Date().getMinutes(),new Date().getSeconds())};const h=this.view.dom.todoModalForm[0].reportValidity(),[{value:n},{value:c},{value:m}]=this.view.dom.todoModalForm;let r=(s=t.dataset)==null?void 0:s.projectIndex,y=(a=t.dataset)==null?void 0:a.todoIndex;if(!h)return;((l=t.dataset)==null?void 0:l.modalAction)==="add"?this.state.addTodo(r,{completed:!1,title:n,dueDate:f(c),priority:m}):this.state.updateTodo(r,y,{title:n,dueDate:f(c),priority:m}),this.view.closeModal(this.view.dom.todoModal),this.view.renderTodosPage({project:this.state.projects[r],projectIndex:r,handler:this.todosPageActions.bind(this),todoHandler:this.todoActions.bind(this)})}}combinedPageActions({target:t}){const e=t.closest(".project-combined").dataset.projectTitle,o=this.state.getProjectIndexByTitle(e);this.view.renderTodosPage({project:this.state.projects[o],projectIndex:o,handler:this.todosPageActions.bind(this),todoHandler:this.todoActions.bind(this)}),this.view.setActiveClassMenuItem(this.view.dom.projectListItems[o])}}document.querySelector("#app").innerHTML=`
  <nav></nav>
  <section>
    <article>
    </article>
  </section>
`;const V=new O;V.init();
