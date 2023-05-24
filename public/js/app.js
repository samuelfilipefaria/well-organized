loadTaskCardsOnScreen();

function loadTaskCardsOnScreen() {
  cleanCurrentTaskCards();

  const tasks = getLocalStorageTasks();

  tasks.forEach(task => { createTaskCard(task); })
}

function cleanCurrentTaskCards() {
  getById("task-list").innerHTML = "";
  getById("task-list-archived").innerHTML = "";
}

function validateNewTask() {
  const taskDescription = getById("task-description-input").value.trim();
  const taskColor = getById("selected-color-code").value;

  if(isNewTaskInvalid(taskDescription, taskColor)) return;

  createTask({
    description: taskDescription,
    color: taskColor,
    done: false,
    archived: false
  });

  resetAddTaskForm();

  loadTaskCardsOnScreen();
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

  if(findTaskIndex(taskDescription) != -1) {
    showModal("Já existe uma tarefa com esta mesma descrição!");
    return true;
  }

  return false;
}

// Manipulando task cards -----------------------------------------------------------------

function createTaskCard(task) {
  let taskCard = create("div");
  let taskCardHeader = create("div");
  let taskCardHeaderCheckbox = create("input");
  taskCardHeaderCheckbox.setAttribute('type', 'checkbox');
  let taskCardBody = create("p");
  let taskCardFooter = create("div");

  taskCard.appendChild(taskCardHeader);
  taskCardHeader.appendChild(taskCardHeaderCheckbox);
  taskCard.appendChild(taskCardBody);
  taskCardBody.innerHTML = task.description;
  taskCard.appendChild(taskCardFooter);
  setTaskCardFooterIcon(task, taskCardFooter);

  printTaskCard(task, taskCard);

  addClass(taskCard, "task-card");
  setTaskCardColor(task, taskCard);
  setTaskCardHeaderStyle(task, taskCardHeader);
  addClass(taskCardHeaderCheckbox, "task-card-header-checkbox");
  addClass(taskCardBody, "task-card-body");
  setTaskCardFooterStyle(task, taskCardFooter);

  taskCardHeader.onclick = changeTaskDoneState;
  taskCardFooter.onclick = changeTaskArchivedState;
}

function setTaskCardFooterIcon(task, taskCardFooter) {
  taskCardFooter.innerHTML = task.archived ? trashIcon() : archiveIcon();
}

function trashIcon() {
  return "<i class='icon icon-delete' title='Deletar'></i>";
}

function archiveIcon() {
  return "<i class='icon icon-copy' title='Arquivar'></i>";
}

function setTaskCardColor(task, taskCard) {
  taskCard.style.backgroundColor = task.color;
  if(task.color == "rgb(218, 245, 250)")  taskCard.children[1].style.color = "#19b5dc";
  if(task.color == "rgb(209, 254, 203)")  taskCard.children[1].style.color = "#58a51d";
  if(task.color == "rgb(246, 208, 246)")  taskCard.children[1].style.color = "#cb65cb";
  if(task.color == "rgb(220, 208, 243)")  taskCard.children[1].style.color = "#9763f9";
  if(task.color == "rgb(252, 252, 203)")  taskCard.children[1].style.color = "#8f8f69";
  if(task.color == "rgb(251, 212, 180)")  taskCard.children[1].style.color = "#ec842e";
  if(task.color == "rgb(255, 255, 255)")  taskCard.children[1].style.color = "#727272";
}

function printTaskCard(task, taskCard) {
  let taskList = getById("task-list");
  let taskListArchived = getById("task-list-archived");

  task.archived ? taskListArchived.appendChild(taskCard) : taskList.appendChild(taskCard);
}

function setTaskCardHeaderStyle(task, taskCardHeader) {
  if(task.done) {
    addClass(taskCardHeader, "task-card-header-done");
    removeClass(taskCardHeader, "task-card-header-not-done");
    setTaskCardHeaderCheckBox(taskCardHeader.children[0], true);
  } else {
    addClass(taskCardHeader, "task-card-header-not-done");
    removeClass(taskCardHeader, "task-card-header-done");
    setTaskCardHeaderCheckBox(taskCardHeader.children[0], false);
  }
}

function setTaskCardHeaderCheckBox(checkbox, state) {
  checkbox.checked = state;
}

function setTaskCardFooterStyle(task, taskCardFooter) {
  if(task.done) {
    addClass(taskCardFooter, "task-card-footer-able");
    removeClass(taskCardFooter, "task-card-footer-disable");
  } else {
    addClass(taskCardFooter, "task-card-footer-disable");
    removeClass(taskCardFooter, "task-card-footer-able");
  }
}

function changeTaskArchivedState(event) {
  if(event.srcElement.localName != "i" || isFooterDisabled(event.srcElement.parentNode)) return;

  const task = getTask(getTaskCardDescription(event.srcElement));
  const taskCardFooter = event.srcElement.parentNode;

  if(task.archived) deleteTask(task);

  updateTask({
    description: getTaskCardDescription(event.srcElement),
    color: getTaskCardColor(event.srcElement.parentNode.parentNode),
    done: getTaskCurrentDoneState(getTaskCardDescription(event.srcElement)),
    archived: !getTaskCurrentArchivedState(getTaskCardDescription(event.srcElement))
  });


  setTaskCardFooterIcon(task, taskCardFooter);

  loadTaskCardsOnScreen();
}

function changeTaskDoneState(event) {
  if(event.srcElement.type != "checkbox") return;

  updateTask({
    description: getTaskCardDescription(event.srcElement),
    color: getTaskCardColor(event.srcElement.parentNode.parentNode),
    done: !getTaskCurrentDoneState(getTaskCardDescription(event.srcElement)),
    archived: getTaskCurrentArchivedState(getTaskCardDescription(event.srcElement))
  });

  const task = getTask(getTaskCardDescription(event.srcElement));

  if(!task.done && task.archived) {
    updateTask({
      description: getTaskCardDescription(event.srcElement),
      color: getTaskCardColor(event.srcElement.parentNode.parentNode),
      done: getTaskCurrentDoneState(getTaskCardDescription(event.srcElement)),
      archived: !getTaskCurrentArchivedState(getTaskCardDescription(event.srcElement))
    });
  }

  setTaskCardHeaderStyle(task, event.srcElement.parentNode);
  setTaskCardFooterStyle(task, event.srcElement.parentNode.parentNode.children[2]);

  loadTaskCardsOnScreen();
}

function isFooterDisabled(footerElement) {
  return [...footerElement.classList][0] == "task-card-footer-disable";
}

function getTaskCardDescription(referenceElement) {
  return referenceElement.parentNode.parentNode.children[1].innerHTML;
}

function getTaskCardColor(TaskCardElement) {
  return TaskCardElement.style.backgroundColor;
}

function getTaskCurrentDoneState(taskDescription) {
  return getTask(taskDescription).done;
}

function getTaskCurrentArchivedState(taskDescription) {
  return getTask(taskDescription).archived;
}

// Manipulando tasks -----------------------------------------------------------------

function getTask(taskDescription) {
 const taskIndex = findTaskIndex(taskDescription);
 return getLocalStorageTasks()[taskIndex] || {};
}

function createTask(task) {
  let tasks = getLocalStorageTasks();
  tasks.push(task);
  setLocalStorageTasks(tasks);
}

function updateTask(task) {
  const taskIndex = findTaskIndex(task.description);
  let tasks = getLocalStorageTasks();
  tasks[taskIndex] = task;
  setLocalStorageTasks(tasks);
}

function deleteTask(task) {
  const taskIndex = findTaskIndex(task.description);
  let tasks = getLocalStorageTasks();
  tasks.splice(taskIndex, 1);
  setLocalStorageTasks(tasks);
  loadTaskCardsOnScreen();
}

function findTaskIndex(taskDescription) {
  return getLocalStorageTasks().findIndex(task => task.description == taskDescription);
}

// Alterando localStorage -----------------------------------------------------------------

function getLocalStorageTasks() {
  return JSON.parse(window.localStorage.getItem("well_organized_tasks")) || [];
}

function setLocalStorageTasks(tasks) {
  window.localStorage.setItem("well_organized_tasks", JSON.stringify(tasks));
}

// Alterando modal -----------------------------------------------------------------

function showModal(message) {
  getById("modal").classList.remove("not-shown");
  getById("modal-message").innerHTML = message;
}

function closeModal() {
  getById("modal").classList.add("not-shown");
}

// Alterando formulário -----------------------------------------------------------------

function showAddTaskForm() {
  addClass(getById("add-task-option"), "not-shown");
  removeClass(getById("add-task-form"), "not-shown");
}

function resetAddTaskForm() {
  getById("task-description-input").value = "";
  getById("selected-color-code").value = "";
  resetOldSelectedColor();
}

function selectColor(element) {
  resetOldSelectedColor();
  addClass(element, "task-color-option-selected");
  getById("selected-color-code").value = element.style.backgroundColor;
}

function resetOldSelectedColor() {
  getByClass("task-color-option").forEach(element => {
    removeClass(element, "task-color-option-selected");
  });
}

// Adicionando e removendo classes -----------------------------------------------------------------

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

// Criando e pegando elementos -----------------------------------------------------------------

function create(tagName) {
  return window.document.createElement(tagName);
}

function getByClass(className) {
  return [...window.document.getElementsByClassName(className)];
}

function getById(elementId) {
  return window.document.getElementById(elementId);
}