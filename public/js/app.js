tasks = [];

loadTasks();

function loadTasks() {
  tasks = JSON.parse(window.localStorage.getItem("well_organized_tasks"));

  tasks.forEach(task => {
    createTaskCard(task.description, task.color);
  })
}

function showAddTaskForm() {
  getElemById("add-task-option").classList.toggle("not-shown");
  getElemById("add-task-form").classList.toggle("not-shown");
}

function resetAddTaskForm() {
  getElemById("task-description-input").value = "";
  getElemById("selected-color-code").value = "";
  resetOldSelectedColor();
}



function createNewTask() {
  const taskDescription = getElemById("task-description-input").value;
  const taskColor = getElemById("selected-color-code").value;

  if(isNewTaskInvalid(taskDescription.trim(), taskColor)) return;

  saveNewTask(taskDescription.trim(), taskColor);

  createTaskCard(taskDescription.trim(), taskColor);

  resetAddTaskForm();
}

function createTaskCard(taskDescription, taskColor) {
  let task = window.document.createElement("div");
  let taskHeader = window.document.createElement("p");
  let taskBody = window.document.createElement("p");
  let taskFooter = window.document.createElement("p");

  task.classList.add("task");
  task.classList.add("animate__animated");
  task.classList.add("animate__zoomIn");
  taskHeader.classList.add("task-header");
  taskBody.classList.add("task-body");
  taskFooter.classList.add("task-footer");

  task.appendChild(taskHeader)
  task.appendChild(taskBody)
  task.appendChild(taskFooter)

  taskBody.innerHTML = taskDescription;
  task.style.backgroundColor = taskColor;

  getElemById("task-list").appendChild(task);
}

function isNewTaskInvalid(taskDescription, taskColor) {
  if(taskDescription == "") {
    showModal("Não é possível deixar o campo 'descrição' vazio!");
    return true;
  }

  if(taskColor == "") {
    showModal("Não é possível deixar o campo 'cor' vazio!");
    return true;
  }

  const existingTasks = JSON.parse(window.localStorage.getItem("well_organized_tasks"));
  let isRepeated = false;

  existingTasks?.map(task => {
    if(task.description == taskDescription) {
      isRepeated = true;
    }
  });

  if(isRepeated) {
    showModalWithOptions("Já existe uma tarefa com esta mesma descrição! Tem certeza que deseja criar outra?");
    return true;
  }
}



function yesPressed() {
  saveNewTask(getElemById("task-description-input").value.trim(), getElemById("selected-color-code").value);
  closeModalWithOptions();
}

function noPressed() {
  closeModalWithOptions();
}



function saveNewTask(taskDescription, taskColor) {
  const newTask = {
    id: [null, undefined].includes(getLastElementId()) ? 1 : getLastElementId() + 1,
    description: taskDescription,
    color: taskColor
  };

  tasks.push(newTask);

  window.localStorage.setItem("well_organized_tasks", JSON.stringify(tasks));
}

function getLastElementId() {
  const currentTaskArray = JSON.parse(window.localStorage.getItem("well_organized_tasks"));
  if(!currentTaskArray) return undefined;
  return currentTaskArray[currentTaskArray.length - 1].id;
}



function selectColor(element) {
  resetOldSelectedColor();
  element.classList.toggle("task-color-option-selected");
  getElemById("selected-color-code").value = element.style.backgroundColor;
}

function resetOldSelectedColor() {
  [...getElemsByClass("task-color-option")].forEach(element => {
    element.classList.remove("task-color-option-selected");
  });
}



function showModalWithOptions(message) {
  getElemById("modal-with-options").classList.remove("not-shown");
  getElemById("modal-with-options-message").innerHTML = message;
}

function closeModalWithOptions() {
  getElemById("modal-with-options").classList.add("not-shown");
}

function showModal(message) {
  getElemById("modal").classList.remove("not-shown");
  getElemById("modal-message").innerHTML = message;
}

function closeModal() {
  getElemById("modal").classList.add("not-shown");
}



function getElemsByClass(className) {
  return window.document.getElementsByClassName(className);
}

function getElemById(elementId) {
  return window.document.getElementById(elementId);
}