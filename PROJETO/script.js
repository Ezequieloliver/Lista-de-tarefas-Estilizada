const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");
const tabs = document.querySelectorAll(".tab");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";
let currentFilter = "all"; 

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = task.title;
    span.addEventListener("click", () => toggleTask(index));

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';
    editBtn.classList.add("edit");
    editBtn.addEventListener("click", () => editTask(index));

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.classList.add("remove");
    removeBtn.addEventListener("click", () => removeTask(index));

    actions.appendChild(editBtn);
    actions.appendChild(removeBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (title) {
    tasks.push({ title, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
});

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newTitle = prompt("Edite a tarefa:", tasks[index].title);
  if (newTitle !== null && newTitle.trim() !== "") {
    tasks[index].title = newTitle.trim();
    saveTasks();
    renderTasks();
  }
}

function applyTheme() {
  if (darkMode) {
    document.body.classList.add("dark");
    themeToggle.innerHTML = '<i class="fa fa-sun"></i>';
  } else {
    document.body.classList.remove("dark");
    themeToggle.innerHTML = '<i class="fa fa-moon"></i>';
  }
  localStorage.setItem("darkMode", darkMode);
}

themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  applyTheme();
});


tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    renderTasks();
  });
});

renderTasks();
applyTheme();
