// ======== ELEMENTS ========
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const weekView = document.getElementById("weekView");
const currentTasksDiv = document.getElementById("currentTasks");
const pastTasksDiv = document.getElementById("pastTasks");
const dayOverview = document.getElementById("dayOverview");
const notesArea = document.getElementById("notesArea");
const saveNotes = document.getElementById("saveNotes");
const saveMessage = document.getElementById("saveMessage");
const backToTopBtn = document.getElementById("backToTop");

// ======== HELPER: Get actual Date object for a task ========
// 🆕 Converts task.day (like "Monday") + time (like "14:30") into a real Date for comparison
function getTaskDateTime(task) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = new Date();
  const todayIndex = today.getDay();
  const taskDayIndex = days.indexOf(task.day);
  if (taskDayIndex === -1) return null;

  const diff = taskDayIndex - todayIndex;
  const taskDate = new Date(today);
  taskDate.setDate(today.getDate() + (diff >= 0 ? diff : diff + 7));

  const [h, m] = task.time.split(":").map(Number);
  taskDate.setHours(h, m, 0, 0);
  return taskDate;
}

// ======== TASK FUNCTIONS ========
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (!taskList) return;
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.day}</strong> - ${task.time} to ${task.endTime}: ${task.title}
      <button onclick="editTask('${task.day}', '${task.time}')">Edit</button>
      <button onclick="deleteTask('${task.day}', '${task.time}')">Delete</button>`;
    taskList.appendChild(li);
  });
}

// ======== ADD TASK ========
if (taskForm) {
  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = taskForm.taskName.value.trim();
    const day = taskForm.taskDay.value;
    const time = taskForm.taskTime.value;
    const endTime = taskForm.taskEndTime.value;
    const details = taskForm.taskDetails.value.trim();

    if (!title || !day || !time || !endTime) return;

    // 🆕 Prevent past scheduling
    const taskDate = getTaskDateTime({ day, time });
    const now = new Date();
    if (taskDate < now) {
      message.textContent = "⚠️ You can’t schedule a task in the past.";
      message.style.color = "red";
      return;
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const duplicate = tasks.some(t => t.day === day && (
      (time >= t.time && time < t.endTime) || (endTime > t.time && endTime <= t.endTime)
    ));

    if (duplicate) {
      message.textContent = "⚠️ This time slot is already booked.";
      message.style.color = "red";
      return;
    }

    tasks.push({ title, day, time, endTime, details, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    message.textContent = "✅ Task added successfully!";
    message.style.color = "green";
    taskForm.reset();
    loadTasks();
    renderWeekView();
    renderDayOverview();
  });
}

// ======== DELETE TASK ========
function deleteTask(day, time) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => !(t.day === day && t.time === time));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  renderWeekView();
  renderDayOverview();
}

// ======== EDIT TASK ========
function editTask(day, time) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(t => t.day === day && t.time === time);
  if (index === -1) return;

  const task = tasks[index];
  const newTitle = prompt("Edit Task Title:", task.title) || task.title;
  const newTime = prompt("Edit Start Time (HH:MM):", task.time) || task.time;
  const newEndTime = prompt("Edit End Time (HH:MM):", task.endTime) || task.endTime;

  // 🆕 Prevent editing into past
  const editDate = getTaskDateTime({ day, time: newTime });
  const now = new Date();
  if (editDate < now) {
    alert("⚠️ You cannot move a task to the past.");
    return;
  }

  const duplicate = tasks.some((t, i) => i !== index && t.day === day && (
    (newTime >= t.time && newTime < t.endTime) || (newEndTime > t.time && newEndTime <= t.endTime)
  ));
  if (duplicate) {
    alert("⚠️ Time slot already booked.");
    return;
  }

  task.title = newTitle;
  task.time = newTime;
  task.endTime = newEndTime;
  tasks[index] = task;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  renderWeekView();
  renderDayOverview();
}

// ======== WEEK-PLANNER CURRENT & PAST TASKS ========
function renderWeekView() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = new Date();

  if (currentTasksDiv) currentTasksDiv.innerHTML = "";
  if (pastTasksDiv) pastTasksDiv.innerHTML = "";

  tasks.forEach(task => {
    const taskStart = getTaskDateTime(task);
    const [eh, em] = task.endTime.split(":").map(Number);
    const taskEnd = new Date(taskStart);
    taskEnd.setHours(eh, em, 0, 0);

    const li = document.createElement("li");
    li.textContent = `${task.day} ${task.time}-${task.endTime}: ${task.title}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(task.day, task.time);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.day, task.time);

    // 🆕 Classify current vs past
    if (taskEnd >= now) {
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      if (currentTasksDiv) currentTasksDiv.appendChild(li);
    } else {
      li.appendChild(deleteBtn);
      if (pastTasksDiv) pastTasksDiv.appendChild(li);
    }
  });
}

// ======== DAY OVERVIEW (unchanged) ========
function renderDayOverview() {
  if (!dayOverview) return;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = new Date();
  const currentWeekDay = today.getDay();

  dayOverview.innerHTML = "";

  for(let i=1; i<=7; i++) {
    const dayIndex = i % 7;
    const dayName = days[dayIndex];
    const dayTasks = tasks.filter(t => t.day === dayName);

    const dayDate = new Date(today);
    const diff = dayIndex - currentWeekDay;
    dayDate.setDate(today.getDate() + (diff >= 0 ? diff : 7 + diff));

    const dayBox = document.createElement("div");
    dayBox.className = "day-card";

    const heading = document.createElement("h3");
    heading.textContent = `${dayName} (${dayDate.getDate()}/${dayDate.getMonth()+1})`;
    dayBox.appendChild(heading);

    const stars = Math.min(5, Math.ceil(dayTasks.length / 2));
    const starDiv = document.createElement("div");
    starDiv.className = "stars";
    for(let s=0; s<stars; s++) starDiv.innerHTML += "⭐";
    dayBox.appendChild(starDiv);

    const ul = document.createElement("ul");
    if(dayTasks.length === 0){
      const p = document.createElement("p");
      p.textContent = "No tasks scheduled.";
      ul.appendChild(p);
    } else {
      dayTasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = `${task.time} - ${task.endTime}: ${task.title}`;
        ul.appendChild(li);
      });
    }
    dayBox.appendChild(ul);
    dayOverview.appendChild(dayBox);
  }
}

// ======== NOTES ========
if (notesArea && saveNotes) {
  notesArea.value = localStorage.getItem("userNotes") || "";
  saveNotes.addEventListener("click", () => {
    localStorage.setItem("userNotes", notesArea.value);
    saveMessage.textContent = "✅ Notes saved successfully!";
    setTimeout(() => saveMessage.textContent = "", 2000);
  });
}

// ======== BACK TO TOP ========
if (backToTopBtn) {
  window.onscroll = () => backToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======== INIT ========
loadTasks();
renderWeekView();
renderDayOverview();
