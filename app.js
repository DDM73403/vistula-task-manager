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

           <button onclick="alert('Delete clicked')">
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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        }
    );

    console.log("Status:", response.status);

    loadTasks();
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
async function deleteTask(id) {

    console.log("DELETE CLICKED", id);

    const response = await fetch(
        `${config.supabaseUrl}/rest/v1/tasks?id=eq.${id}`,
        {
            method: "DELETE",
            headers: {
                apikey: config.supabasePublishableKey,
                Authorization: `Bearer ${config.supabasePublishableKey}`
            }
        }
    );

    console.log("DELETE STATUS:", response.status);

    const result = await response.text();

    console.log("DELETE RESPONSE:", result);

    loadTasks();
}
window.deleteTask = deleteTask;
loadConfig();