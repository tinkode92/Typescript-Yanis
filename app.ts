import { Task } from "./js/taskModule";
import { Category } from "./js/categoryModule";
import { TaskManager } from "./js/TaskManager.js";
import { CategoryManager } from "./js/CategoryManager.js";


let taskManager = new TaskManager();


let title: string;
let description: string;
let date: Date;
let etat: string;

function saveTasks() {
  const tasks = taskManager.getTasks();
  console.log('sauvegardes tâches :', tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("tasks");
  if (taskJSON === null) return [];
  const tasks = JSON.parse(taskJSON);
  return tasks;
}

const tasks: Task[] = loadTasks();
tasks.forEach(task => {
  taskManager.addTask(task);

  let taskElement = createTaskElement(task);

  let tasksDiv = document.querySelector("#tasks");
  tasksDiv!.appendChild(taskElement);
});

document.querySelector("#taskForm")!.addEventListener("submit", function (event) {
  event.preventDefault();

  title = (document.querySelector("#taskTitle") as HTMLInputElement).value;
  description = (document.querySelector("#taskDescription") as HTMLInputElement).value;
  date = new Date((document.querySelector("#taskDueDate") as HTMLInputElement).value);
  etat = (document.querySelector("#taskPriority") as HTMLInputElement).value;

  if (title && description && date && etat) {
    createNewTask(title, description, date, etat);
    envoieFormulaire(event);
  } else {
    alert("Veuillez remplir tous les champs");
  }
});

function createNewTask(title: string, description: string, date: Date, etat: string): Task {


  let newTask: Task = {
    id: taskManager.getTasks().length + 1,
    titre: title,
    description: description,
    date: date,
    etat: etat,
  };

  return newTask;
}


function envoieFormulaire(event: Event) {
  event.preventDefault();

  let newTask = createNewTask(title, description, date, etat);

  taskManager.addTask(newTask);
  saveTasks();

  console.log(taskManager.getTasks());

  let taskElement = createTaskElement(newTask);
  let tasksDiv = document.querySelector("#tasks");
  tasksDiv!.appendChild(taskElement);
}

function createTaskElement(newTask: Task): HTMLElement {

  let taskDiv = document.createElement("div");

  let date = new Date(newTask.date);
  let isValidDate = !isNaN(date.getTime());

  taskDiv.className = `task ${newTask.etat}`;



  let etatString: string;
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

    let updateForm = document.querySelector("#updateForm") as HTMLFormElement;

    updateForm.addEventListener("submit", function (event) {
      updateTask(event);
    });
  });

  taskDiv.appendChild(modifyButton);

  return taskDiv;
}

let modal = document.querySelector(".modal") as HTMLElement;
let closeButton = document.querySelector(".close") as HTMLElement;


function toggleModal() {
  modal.style.display = modal.style.display === "none" ? "block" : "none";
}

closeButton.addEventListener("click", toggleModal);


function preFillForm(taskId: number) {
  const task = taskManager.getTasks().find(task => task.id === taskId);

  if (task) {
    (document.getElementById("updateTitle") as HTMLInputElement).value = task.titre;
    (document.getElementById("updateDescription") as HTMLTextAreaElement).value = task.description;
    (document.getElementById("updateDate") as HTMLInputElement).value = task.date.toISOString().split("T")[0];
    (document.getElementById("updateEtat") as HTMLSelectElement).value = task.etat;

    (document.querySelector("#updateTaskId") as HTMLInputElement).value = taskId.toString();
  }
}

function updateTask(event: Event) {
  event.preventDefault();

  let taskId = parseInt((document.querySelector("#updateTaskId") as HTMLInputElement).value);

  let title = (document.querySelector("#updateTitle") as HTMLInputElement).value;
  let description = (document.querySelector("#updateDescription") as HTMLTextAreaElement).value;
  let date = new Date((document.querySelector("#updateDate") as HTMLInputElement).value);
  let etat = (document.querySelector("#updateEtat") as HTMLSelectElement).value;

  taskManager.updateTask(taskId, title, description, date, etat);
  console.log(taskManager.getTasks());

}

let updateForm = document.querySelector("#updateForm") as HTMLFormElement;
updateForm.addEventListener("submit", updateTask);

let categoryManager = new CategoryManager();

document.querySelector("#addCategory")!.addEventListener("click", function (event) {
  event.preventDefault();

  let categoryName = (document.querySelector("#categoryTitle") as HTMLInputElement).value;

  if (categoryName) {
    addCategory(categoryName);
  } else {
    alert("Veuillez entrer le nom de la catégorie");
  }
});

function addCategory(categoryName: string) {
  let category: Category = {
    id: categoryManager.getCategories().length + 1,
    name: categoryName,
    tasks: []
  };

  categoryManager.addCategory(category);
  updateCategoryOptions();
}

function updateCategoryOptions() {
  let taskCategorySelect = document.querySelector("#taskCategory") as HTMLSelectElement;

  // Clear existing options
  taskCategorySelect.innerHTML = '<option value="">Choisir une catégorie</option>';

  // Add updated options
  categoryManager.getCategories().forEach(category => {
    let option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    taskCategorySelect.appendChild(option);
  });
}


function filtreTask() {
  let filterValuePriorityElement = document.querySelector("#filterPriority") as HTMLInputElement;

  let filterValuePriority = filterValuePriorityElement.value;

  console.log(filterValuePriority);


}

document.querySelector("#applyFilter")!.addEventListener("submit", filtreTask);


