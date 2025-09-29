// Load activities and history from localStorage
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

const form = document.getElementById('plannerForm');
const weekGrid = document.getElementById('weekGrid');
const historyList = document.getElementById('historyList');
const errorMsg = document.getElementById('errorMsg');

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
let editIndex = null;

// Utility: move past activities to history
function archivePastActivities() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const remaining = [];
  activities.forEach((a) => {
    if (a.date < today) {
      history.push(a);
    } else {
      remaining.push(a);
    }
  });
  activities = remaining;
  localStorage.setItem('activities', JSON.stringify(activities));
  localStorage.setItem('history', JSON.stringify(history));
}

// Render weekly overview
function renderGrid() {
  archivePastActivities();
  weekGrid.innerHTML = '';
  days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.innerHTML = `<h3>${day}</h3>`;
    const dayActivities = activities
      .map((a, index) => ({...a, index}))
      .filter(a => a.day === day);
    dayActivities.sort((a,b) => a.start.localeCompare(b.start));
    dayActivities.forEach(a => {
      const actDiv = document.createElement('div');
      actDiv.classList.add('activity');
      actDiv.innerHTML = `
        ${a.date} - ${a.start}-${a.end} ${a.title}
        <div class="activity-buttons">
          <button onclick="editActivity(${a.index})">Edit</button>
          <button onclick="deleteActivity(${a.index})">Delete</button>
        </div>
      `;
      dayDiv.appendChild(actDiv);
    });
    weekGrid.appendChild(dayDiv);
  });
  renderHistory();
}

// Render past activities
function renderHistory() {
  historyList.innerHTML = '';
  history.sort((a,b) => a.date.localeCompare(b.date));
  history.forEach(a => {
    const div = document.createElement('div');
    div.textContent = `${a.date} - ${a.start}-${a.end} ${a.title} (${a.day})`;
    historyList.appendChild(div);
  });
}

// Check overlap for a day
function isOverlap(day, start, end, skipIndex=null) {
  const dayActs = activities.filter((a,i) => a.day === day && i !== skipIndex);
  for (let a of dayActs) {
    if (!(end <= a.start || start >= a.end)) {
      return true;
    }
  }
  return false;
}

// Form submit for add/edit
form.addEventListener('submit', e => {
  e.preventDefault();
  errorMsg.textContent = '';

  const title = document.getElementById('activityTitle').value.trim();
  const day = document.getElementById('activityDay').value;
  const date = document.getElementById('activityDate').value;
  const start = document.getElementById('startTime').value;
  const end = document.getElementById('endTime').value;

  if (!title || !day || !start || !end || !date) return;

  if (end <= start) {
    errorMsg.textContent = 'End time must be after start time.';
    return;
  }

  if (isOverlap(day, start, end, editIndex)) {
    errorMsg.textContent = 'This time slot is already taken!';
    return;
  }

  if (editIndex !== null) {
    activities[editIndex] = {title, day, start, end, date};
    editIndex = null;
  } else {
    activities.push({title, day, start, end, date});
  }

  localStorage.setItem('activities', JSON.stringify(activities));
  form.reset();
  renderGrid();
});

// Delete activity
function deleteActivity(index) {
  if (confirm('Are you sure you want to delete this activity?')) {
    activities.splice(index,1);
    localStorage.setItem('activities', JSON.stringify(activities));
    renderGrid();
  }
}

// Edit activity
function editActivity(index) {
  const act = activities[index];
  document.getElementById('activityTitle').value = act.title;
  document.getElementById('activityDay').value = act.day;
  document.getElementById('activityDate').value = act.date;
  document.getElementById('startTime').value = act.start;
  document.getElementById('endTime').value = act.end;
  editIndex = index;
}

renderGrid();

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
