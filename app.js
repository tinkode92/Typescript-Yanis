import { TaskManager } from "./js/TaskManager.js";
import { CategoryManager } from "./js/CategoryManager.js";
let taskManager = new TaskManager();
let title;
let description;
let date;
let etat;


function saveTasks() {
    const tasks = taskManager.getTasks();
    console.log('sauvegardes tâches :', tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const taskJSON = localStorage.getItem("tasks");
    if (taskJSON === null)
        return [];
    const tasks = JSON.parse(taskJSON);
    return tasks;
}
const tasks = loadTasks();
tasks.forEach(task => {
    taskManager.addTask(task);
    let taskElement = createTaskElement(task);
    let tasksDiv = document.querySelector("#tasks");
    tasksDiv.appendChild(taskElement);
});

document.querySelector("#taskForm").addEventListener("submit", function (event) {
    event.preventDefault();
    title = document.querySelector("#taskTitle").value;
    description = document.querySelector("#taskDescription").value;
    date = new Date(document.querySelector("#taskDueDate").value);
    etat = document.querySelector("#taskPriority").value;
    if (title && description && date && etat) {
        createNewTask(title, description, date, etat);
        envoieFormulaire(event);
    }
    else {
        alert("Veuillez remplir tous les champs");
    }
});
function createNewTask(title, description, date, etat) {
    let newTask = {
        id: taskManager.getTasks().length + 1,
        titre: title,
        description: description,
        date: date,
        etat: etat,
    };
    return newTask;
}
function envoieFormulaire(event) {
    event.preventDefault();
    let newTask = createNewTask(title, description, date, etat);
    taskManager.addTask(newTask);
    saveTasks();
    console.log(taskManager.getTasks());
    let taskElement = createTaskElement(newTask);
    let tasksDiv = document.querySelector("#tasks");
    tasksDiv.appendChild(taskElement);
}

function createTaskElement(newTask) {
    let taskDiv = document.createElement("div");
    let date = new Date(newTask.date);
    let isValidDate = !isNaN(date.getTime());
    taskDiv.className = `task ${newTask.etat}`;
    
    let etatString;
    if (newTask.etat === "high") {
        etatString = "Priorité haute";
    }
    else if (newTask.etat === "medium") {
        etatString = "Priorité moyenne";
    }
    else {
        etatString = "Priorité basse";
    }
    let h3 = document.createElement("h3");
    h3.textContent = `${newTask.titre} `;
    let span = document.createElement("span");
    span.textContent = `– ${etatString}`;
    h3.appendChild(span);
    taskDiv.appendChild(h3);
    let dateP = document.createElement("p");
    dateP.textContent = `Date d'échéance: ${date.toISOString().split("T")[0]}`;
    taskDiv.appendChild(dateP);
    let category = document.createElement("p");
    taskDiv.appendChild(category);
    let descriptionP = document.createElement("p");
    descriptionP.textContent = `${newTask.description}`;
    taskDiv.appendChild(descriptionP);
    let deleteButton = document.createElement('button');
    deleteButton.type = "button";
    deleteButton.className = "deleteTask";
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener('click', () => {
        taskManager.deleteTask(newTask.id);
        taskDiv.remove();
        saveTasks();
        console.log(taskManager.getTasks());
    });
    taskDiv.appendChild(deleteButton);
    let modifyButton = document.createElement('button');
    modifyButton.className = "buttonModify, edit-btn";
    modifyButton.textContent = "Modifier";
    modifyButton.addEventListener('click', () => {
        toggleModal();
        preFillForm(newTask.id);
        let updateForm = document.querySelector("#updateForm");
        updateForm.addEventListener("submit", function (event) {
            updateTask(event);
        });
    });
    taskDiv.appendChild(modifyButton);
    return taskDiv;
}

let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close");
function toggleModal() {
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}
closeButton.addEventListener("click", toggleModal);

function preFillForm(taskId) {
    const task = taskManager.getTasks().find(task => task.id === taskId);
    if (task) {
        document.getElementById("updateTitle").value = task.titre;
        document.getElementById("updateDescription").value = task.description;
        document.getElementById("updateDate").value = task.date.toISOString().split("T")[0];
        document.getElementById("updateEtat").value = task.etat;
        document.querySelector("#updateTaskId").value = taskId.toString();
    }
}
function updateTask(event) {
    event.preventDefault();
    let taskId = parseInt(document.querySelector("#updateTaskId").value);
    let title = document.querySelector("#updateTitle").value;
    let description = document.querySelector("#updateDescription").value;
    let date = new Date(document.querySelector("#updateDate").value);
    let etat = document.querySelector("#updateEtat").value;
    taskManager.updateTask(taskId, title, description, date, etat);
    console.log(taskManager.getTasks());
}
let updateForm = document.querySelector("#updateForm");
updateForm.addEventListener("submit", updateTask);

let categoryManager = new CategoryManager();
document.querySelector("#addCategory").addEventListener("click", function (event) {
    event.preventDefault();
    let categoryName = document.querySelector("#categoryTitle").value;
    if (categoryName) {
        addCategory(categoryName);
    }
    else {
        alert("Veuillez entrer le nom de la catégorie");
    }
});
function addCategory(categoryName) {
    let category = {
        id: categoryManager.getCategories().length + 1,
        name: categoryName,
        tasks: []
    };
    categoryManager.addCategory(category);
    updateCategoryOptions();
}
function updateCategoryOptions() {
    let taskCategorySelect = document.querySelector("#taskCategory");
    taskCategorySelect.innerHTML = '<option value="">Choisir une catégorie</option>';
    categoryManager.getCategories().forEach(category => {
        let option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        taskCategorySelect.appendChild(option);
    });
}

function filtreTask() {
    let filterValuePriorityElement = document.querySelector("#filterPriority");
    let filterValuePriority = filterValuePriorityElement.value;
    console.log(filterValuePriority);
}
document.querySelector("#applyFilter").addEventListener("submit", filtreTask);
