
/* ========================================
   MECHATRACK - MAIN JAVASCRIPT
   ======================================== */


/* ========================================
   1. HTML ELEMENTS
   ======================================== */

const courseCount = document.getElementById("coursecount");
const addCourseButton = document.getElementById("add-course");
const progressCount = document.getElementById("progress-count");

const courseListElement = document.getElementById("course-list");
const courseInput = document.getElementById("course-input");
const courseMessage = document.getElementById("course-message");

const taskCount = document.getElementById("task-count");
const taskListElement = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const taskCourseInput = document.getElementById("task-course");
const addTaskButton = document.getElementById("add-task");
const taskMessage = document.getElementById("task-message");

const upcomingTaskList =
    document.getElementById("upcoming-task-list");


/* ========================================
   2. LOAD SAVED DATA
   ======================================== */

function loadSavedData(key, defaultValue) {
    try {
        const savedData = localStorage.getItem(key);

        if (savedData === null) {
            return defaultValue;
        }

        const parsedData = JSON.parse(savedData);

        if (Array.isArray(parsedData)) {
            return parsedData;
        }

        return defaultValue;

    } catch (error) {
        console.error("Error loading " + key + ":", error);
        return defaultValue;
    }
}


let courseList = loadSavedData("mechatrackCourses", [
    "MTH 101",
    "PHY 101",
    "CHM 101",
    "GST 111",
    "EEE 111"
]);

let taskList = loadSavedData("mechatrackTasks", []);


let projectList = loadSavedData("mechatrackProjects", []);



/* ========================================
   3. COURSE MANAGEMENT
   ======================================== */

function displayCourses() {
    courseListElement.innerHTML = "";

    courseList.forEach(function(course, index) {
        const courseItem = document.createElement("div");
        courseItem.classList.add("course-item");

        const courseName = document.createElement("span");
        courseName.textContent = course;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("course-remove-button");

        removeButton.addEventListener("click", function() {
            courseList.splice(index, 1);

            courseMessage.textContent = course + " removed.";

            updateCourses();
        });

        courseItem.appendChild(courseName);
        courseItem.appendChild(removeButton);

        courseListElement.appendChild(courseItem);
    });
}


function updateCourseCount() {
    courseCount.textContent = courseList.length;
}


function updateTaskCourseOptions() {
    taskCourseInput.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select course";

    taskCourseInput.appendChild(defaultOption);

    courseList.forEach(function(course) {
        const option = document.createElement("option");

        option.value = course;
        option.textContent = course;

        taskCourseInput.appendChild(option);
    });
}


function updateCourses() {
    localStorage.setItem(
        "mechatrackCourses",
        JSON.stringify(courseList)
    );

    updateCourseCount();
    displayCourses();
    updateTaskCourseOptions();
}


addCourseButton.addEventListener("click", function() {
    const newCourse = courseInput.value.trim();

    if (newCourse === "") {
        courseMessage.textContent = "Please enter a course.";
        return;
    }

    if (courseList.includes(newCourse)) {
        courseMessage.textContent = "That course already exists.";
        return;
    }

    courseList.push(newCourse);

    courseInput.value = "";
    courseMessage.textContent = "Course added successfully.";

    updateCourses();
});


/* ========================================
   4. PROGRESS TRACKING
   ======================================== */

function updateProgress() {
    if (taskList.length === 0) {
        progressCount.textContent = "0%";
        return;
    }

    const completedTasks = taskList.filter(function(task) {
        return task.completed;
    }).length;

    const progress =
        (completedTasks / taskList.length) * 100;

    progressCount.textContent = Math.round(progress) + "%";
}


/* ========================================
   5. DISPLAY TASKS
   ======================================== */

function displayTasks() {
    taskListElement.innerHTML = "";

    taskList.forEach(function(task, index) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("dashboard-task");

        // Task information
        const taskInfo = document.createElement("div");

        // Completion checkbox
        const taskCheckbox = document.createElement("input");
        taskCheckbox.type = "checkbox";
        taskCheckbox.checked = task.completed;

        taskCheckbox.addEventListener("change", function() {
            task.completed = taskCheckbox.checked;
            updateTasks();
        });

        // Task name and course
        const taskDetails = document.createElement("div");

        const taskName = document.createElement("strong");
        taskName.textContent = task.name;

        const taskCourse = document.createElement("span");
        taskCourse.textContent = task.course;

        if (task.completed) {
            taskName.style.textDecoration = "line-through";
            taskName.style.opacity = "0.5";
        }

        taskDetails.appendChild(taskName);
        taskDetails.appendChild(taskCourse);

        taskInfo.appendChild(taskCheckbox);
        taskInfo.appendChild(taskDetails);

        // Remove task button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("task-remove-button");

        removeButton.addEventListener("click", function() {
            taskList.splice(index, 1);
            updateTasks();
        });

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(removeButton);

        taskListElement.appendChild(taskItem);
    });
}


/* ========================================
   6. UPCOMING TASKS
   ======================================== */

function displayUpcomingTasks() {
    upcomingTaskList.innerHTML = "";

    if (taskList.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent =
            "No tasks yet. Add a task above to see it here.";

        upcomingTaskList.appendChild(emptyMessage);
        return;
    }

    taskList.forEach(function(task) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("upcoming-task");

        // Task information
        const taskInfo = document.createElement("div");
        taskInfo.classList.add("upcoming-task-info");

        const taskName = document.createElement("strong");
        taskName.textContent = task.name;

        const taskCourse = document.createElement("span");
        taskCourse.textContent = task.course;

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskCourse);

        // Task status
        const taskStatus = document.createElement("span");
        taskStatus.classList.add("upcoming-task-status");

        taskStatus.textContent = task.completed
            ? "Completed"
            : "Pending";

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(taskStatus);

        upcomingTaskList.appendChild(taskItem);
    });
}


/* ========================================
   7. UPDATE AND SAVE TASKS
   ======================================== */

function updateTasks() {
    localStorage.setItem(
        "mechatrackTasks",
        JSON.stringify(taskList)
    );

    taskCount.textContent = taskList.length;

    displayTasks();
    displayUpcomingTasks();
    updateProgress();
}


/* ========================================
   8. ADD NEW TASK
   ======================================== */

addTaskButton.addEventListener("click", function() {
    const newTask = taskInput.value.trim();
    const newTaskCourse = taskCourseInput.value.trim();

    if (newTask === "" || newTaskCourse === "") {
        taskMessage.textContent =
            "Please enter the task and course.";
        return;
    }

    const task = {
        name: newTask,
        course: newTaskCourse,
        completed: false
    };

    taskList.push(task);

    taskInput.value = "";
    taskCourseInput.value = "";

    taskMessage.textContent = "Task added successfully.";

    updateTasks();
});


/* ========================================
   PROJECT MANAGEMENT
   ======================================== */


/* ========================================
   PROJECT MANAGEMENT
   ======================================== */

const projectCount = document.getElementById("project-count");
const projectListElement = document.getElementById("project-list");
const projectInput = document.getElementById("project-input");
const projectStatusInput = document.getElementById("project-status");
const addProjectButton = document.getElementById("add-project");
const projectMessage = document.getElementById("project-message");


function displayProjects() {
    projectListElement.innerHTML = "";

    projectList.forEach(function(project, index) {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");

        // Project name
        const projectName = document.createElement("strong");
        projectName.textContent = project.name;

        // Project status dropdown
        const statusSelect = document.createElement("select");
        statusSelect.classList.add("project-status-select");

        const statuses = [
            "Planned",
            "In progress",
            "Completed"
        ];

        statuses.forEach(function(status) {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;

            if (project.status === status) {
                option.selected = true;
            }

            statusSelect.appendChild(option);
        });

        statusSelect.addEventListener("change", function() {
            project.status = statusSelect.value;
            updateProjects();

            projectMessage.textContent =
                project.name + " status updated.";
        });

        // Project progress slider
        const progressLabel = document.createElement("label");
        progressLabel.textContent =
            "Progress: " + (project.progress || 0) + "%";

        const progressSlider = document.createElement("input");
        progressSlider.type = "range";
        progressSlider.min = 0;
        progressSlider.max = 100;
        progressSlider.step = 5;
        progressSlider.value = project.progress || 0;
        progressSlider.classList.add("project-progress-slider");

        progressSlider.addEventListener("input", function() {
            progressLabel.textContent =
                "Progress: " + progressSlider.value + "%";
        });

        progressSlider.addEventListener("change", function() {
            project.progress = Number(progressSlider.value);

            // Automatically mark 100% projects as completed.
            if (project.progress === 100) {
                project.status = "Completed";
            } else if (project.status === "Completed") {
                project.status = "In progress";
            }

            updateProjects();

            projectMessage.textContent =
                project.name + " progress saved.";
        });

        // Remove project
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("task-remove-button");

        removeButton.addEventListener("click", function() {
            projectList.splice(index, 1);

            updateProjects();

            projectMessage.textContent = "Project removed.";
        });

        // Assemble project card
        projectItem.appendChild(projectName);
        projectItem.appendChild(statusSelect);
        projectItem.appendChild(progressLabel);
        projectItem.appendChild(progressSlider);
        projectItem.appendChild(removeButton);

        projectListElement.appendChild(projectItem);
    });
}



function updateProjects() {
    localStorage.setItem(
        "mechatrackProjects",
        JSON.stringify(projectList)
    );

    projectCount.textContent = projectList.length;

    const totalProjects = projectList.length;

    const completedProjects = projectList.filter(function(project) {
        return project.status === "Completed";
    }).length;

    const activeProjects = projectList.filter(function(project) {
        return project.status === "In progress";
    }).length;

    const totalProgress = projectList.reduce(function(total, project) {
        return total + (Number(project.progress) || 0);
    }, 0);

    const averageProgress = totalProjects === 0
        ? 0
        : Math.round(totalProgress / totalProjects);

    document.getElementById("total-projects").textContent =
        totalProjects;

    document.getElementById("completed-projects").textContent =
        completedProjects;

    document.getElementById("active-projects").textContent =
        activeProjects;

    document.getElementById("average-project-progress").textContent =
        averageProgress + "%";

    displayProjects();
}


addProjectButton.addEventListener("click", function() {
    const projectName = projectInput.value.trim();
    const projectStatus = projectStatusInput.value;

    if (projectName === "") {
        projectMessage.textContent =
            "Please enter a project name.";
        return;
    }

    const projectExists = projectList.some(function(project) {
        return project.name.toLowerCase() === projectName.toLowerCase();
    });

    if (projectExists) {
        projectMessage.textContent =
            "That project already exists.";
        return;
    }

    const project = {
        name: projectName,
        status: projectStatus,
        progress: 0
    };

    projectList.push(project);

    projectInput.value = "";

    projectMessage.textContent =
        "Project added successfully.";

    updateProjects();
});


/* ========================================
   9. INITIALIZE DASHBOARD
   ======================================== */

// Load and display saved courses.
updateCourses();

// Load and display saved tasks.
updateTasks();

//Load and display saved projects
updateProjects();