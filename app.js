let config;

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

                    <button class="edit-task">
                        Edit
                    </button>

                    <button class="toggle-task">
                        Toggle
                    </button>

                    <button class="delete-task">
                        Delete
                    </button>
                </div>
            `;
        });

    } catch (error) {

        document.getElementById(
            "status-message"
        ).textContent =
            "Failed to load tasks";
    }
}

loadConfig();