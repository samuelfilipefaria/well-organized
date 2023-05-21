function showAddTaskForm() {
  getElem("add-task-option").classList.toggle("not-shown");
  getElem("add-task-form").classList.toggle("not-shown");
}

function createNewTask() {
  const taskDescription = getElem("task-description-input").value;
  const taskColor = getElem("selected-color-code").value;

  if(isNewTaskInvalid(taskDescription)) return;

  resetAddTaskForm();
}

function resetAddTaskForm() {
  getElem("task-description-input").value = "";
  getElem("selected-color-code").value = "";
  resetOldSelectedColor();
}

function isNewTaskInvalid(taskDescription) {
  if(taskDescription.trim() === "") return true;
}

function selectColor(element) {
  resetOldSelectedColor();
  element.classList.toggle("task-color-option-selected");
  getElem("selected-color-code").value = element.style.backgroundColor;
}

function resetOldSelectedColor() {
  [...getElemsByClass("task-color-option")].forEach(element => {
    element.classList.remove("task-color-option-selected");
  });
}

function getElemsByClass(className) {
  return window.document.getElementsByClassName(className);
}

function getElem(elementId) {
  return window.document.getElementById(elementId);
}