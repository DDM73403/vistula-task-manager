let config;
let editingId = null;

async function loadConfig() {
    const response = await fetch("config.json");
    config = await response.json();

    loadTasks();
}

async function loadTasks() {
    try {
        const response = await fetch(
            `${config.supabaseUrl}/rest/v1/tasks?select=*`,
            {
                headers: {
                    apikey: config.supabasePublishableKey
                }
            }
        );

        const tasks = await response.json();

        displayTasks(tasks);

    } catch (error) {
        showMessage("Failed to load tasks");
    }
}

function displayTasks(tasks) {

    const container =
        document.getElementById("task-list");

    container.innerHTML = "";

    tasks.forEach(task => {

        container.innerHTML += `
        <div class="task-item" data-id="${task.id}">

            <h3 class="task-title">${task.title}</h3>

            <p class="task-description">
                ${task.description || ""}
            </p>

            <p class="task-status">
                ${task.completed ? "Completed" : "Incomplete"}
            </p>

            <button
                class="toggle-task"
                onclick="toggleTask(${task.id}, ${task.completed})">
                Toggle
            </button>

            <button
                class="delete-task"
                onclick="deleteTask(${task.id})">
                Delete
            </button>

        </div>
        `;
    });
}

function showMessage(text) {
    document.getElementById("status-message")
        .textContent = text;
}

loadConfig();