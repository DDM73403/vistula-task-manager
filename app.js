let config;

async function loadConfig() {
    const response = await fetch("config.json");
    config = await response.json();

    loadTasks();
}

async function loadTasks() {
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
}

function displayTasks(tasks) {

    const taskList =
        document.getElementById("task-list");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        taskList.innerHTML += `
        <div class="task-item" data-id="${task.id}">

            <h3 class="task-title">${task.title}</h3>

            <p class="task-description">
                ${task.description || ""}
            </p>

            <p class="task-status">
                ${task.completed ? "Completed" : "Incomplete"}
            </p>

            <button onclick="toggleTask(${task.id}, ${task.completed})">
                Toggle
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>

        </div>
        `;
    });
}

async function addTask(title, description) {

    const response = await fetch(
        `${config.supabaseUrl}/rest/v1/tasks`,
        {
            method: "POST",
            headers: {
                apikey: config.supabasePublishableKey,
                Authorization: `Bearer ${config.supabasePublishableKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        }
    );

    const data = await response.text();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", data);

    await loadTasks();
}
document
.getElementById("task-form")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title =
        document.getElementById("task-title").value;

    const description =
        document.getElementById("task-description").value;

    await addTask(title, description);

    e.target.reset();
});

loadConfig();