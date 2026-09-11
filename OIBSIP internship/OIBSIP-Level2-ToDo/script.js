const newTaskButton =
    document.getElementById("newTaskButton");

const noteModal =
    document.getElementById("noteModal");

const customizeModal =
    document.getElementById("customizeModal");

const viewModal =
    document.getElementById("viewModal");


const closeModal =
    document.getElementById("closeModal");

const closeCustomize =
    document.getElementById("closeCustomize");

const closeView =
    document.getElementById("closeView");


const taskInput =
    document.getElementById("taskInput");

const taskTitle =
    document.getElementById("taskTitle");

const taskImage =
    document.getElementById("taskImage");


const saveTask =
    document.getElementById("saveTask");

const saveCustomize =
    document.getElementById("saveCustomize");


const taskList =
    document.getElementById("taskList");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const clearCompleted =
    document.getElementById("clearCompleted");


const filterButtons =
    document.querySelectorAll(".filter");

const themeButtons =
    document.querySelectorAll(".theme-option");


/* VIEW NOTE ELEMENTS */

const viewPaper =
    document.getElementById("viewPaper");

const viewTitle =
    document.getElementById("viewTitle");

const viewText =
    document.getElementById("viewText");

const viewImageContainer =
    document.getElementById("viewImageContainer");

const viewEdit =
    document.getElementById("viewEdit");

const viewCustomize =
    document.getElementById("viewCustomize");


/* DATA */

let tasks = [];

let currentFilter = "all";

let selectedTaskId = null;

let selectedTheme = "cream";

let viewingTaskId = null;

let editingTaskId = null;


/* =========================
   NEW NOTE
========================= */

newTaskButton.addEventListener("click", () => {

    editingTaskId = null;

    taskInput.value = "";

    document.getElementById("noteModalTitle")
        .textContent = "Write your note";

    saveTask.textContent = "Save Note";

    noteModal.classList.add("show");

    setTimeout(() => {
        taskInput.focus();
    }, 100);

});


/* =========================
   SAVE / EDIT NOTE
========================= */

saveTask.addEventListener("click", () => {

    const text =
        taskInput.value.trim();

    if (text === "") {

        taskInput.focus();

        return;
    }


    /* EDIT EXISTING NOTE */

    if (editingTaskId !== null) {

        const task =
            tasks.find(
                item => item.id === editingTaskId
            );

        if (task) {
            task.text = text;
        }

        editingTaskId = null;

        closeNote();

        renderTasks();

        return;
    }


    /* CREATE NEW NOTE */

    const newTask = {

        id: Date.now(),

        text: text,

        title: "",

        image: "",

        theme: "cream",

        completed: false

    };


    tasks.push(newTask);

    closeNote();

    renderTasks();

});


/* =========================
   CLOSE NEW NOTE
========================= */

closeModal.addEventListener(
    "click",
    closeNote
);


function closeNote() {

    noteModal.classList.remove("show");

    editingTaskId = null;

}


/* =========================
   OPEN VIEW NOTE
========================= */

function openViewNote(task) {

    viewingTaskId = task.id;

    viewTitle.textContent =
        task.title || "My Task";

    viewText.textContent =
        task.text;


    /* THEME */

    viewPaper.dataset.theme =
        task.theme || "cream";


    /* IMAGE */

    if (task.image) {

        viewImageContainer.innerHTML = `

            <img
                src="${escapeHTML(task.image)}"
                alt="Note image"
                onerror="this.style.display='none'"
            >

        `;

    } else {

        viewImageContainer.innerHTML = "";

    }


    viewModal.classList.add("show");

}


/* =========================
   CLOSE VIEW
========================= */

closeView.addEventListener(
    "click",
    closeViewNote
);


function closeViewNote() {

    viewModal.classList.remove("show");

    viewingTaskId = null;

}


/* =========================
   VIEW OUTSIDE CLICK
========================= */

viewModal.addEventListener(
    "click",
    (event) => {

        if (event.target === viewModal) {

            closeViewNote();

        }

    }
);


/* =========================
   EDIT NOTE
========================= */

viewEdit.addEventListener(
    "click",
    () => {

        const task =
            tasks.find(
                item => item.id === viewingTaskId
            );

        if (!task) return;


        editingTaskId =
            task.id;

        taskInput.value =
            task.text;


        document.getElementById(
            "noteModalTitle"
        ).textContent =
            "Edit your note";


        saveTask.textContent =
            "Save Changes";


        closeViewNote();

        noteModal.classList.add("show");

        setTimeout(() => {
            taskInput.focus();
        }, 100);

    }
);


/* =========================
   OPEN CUSTOMIZE
========================= */

function openCustomize(task) {

    selectedTaskId =
        task.id;

    taskTitle.value =
        task.title || "";

    taskImage.value =
        task.image || "";


    selectedTheme =
        task.theme || "cream";


    themeButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.theme ===
                selectedTheme
            );

        }
    );


    customizeModal.classList.add(
        "show"
    );

}


/* =========================
   VIEW → CUSTOMIZE
========================= */

viewCustomize.addEventListener(
    "click",
    () => {

        const task =
            tasks.find(
                item => item.id === viewingTaskId
            );

        if (!task) return;


        closeViewNote();

        openCustomize(task);

    }
);


/* =========================
   SAVE CUSTOMIZE
========================= */

saveCustomize.addEventListener(
    "click",
    () => {

        const task =
            tasks.find(
                item => item.id === selectedTaskId
            );

        if (!task) return;


        task.title =
            taskTitle.value.trim();

        task.image =
            taskImage.value.trim();

        task.theme =
            selectedTheme;


        closeCustomizeModal();

        renderTasks();

    }
);


/* =========================
   CLOSE CUSTOMIZE
========================= */

closeCustomize.addEventListener(
    "click",
    closeCustomizeModal
);


function closeCustomizeModal() {

    customizeModal.classList.remove(
        "show"
    );

    selectedTaskId = null;

}


/* =========================
   CUSTOMIZE OUTSIDE CLICK
========================= */

customizeModal.addEventListener(
    "click",
    (event) => {

        if (event.target === customizeModal) {

            closeCustomizeModal();

        }

    }
);


/* =========================
   THEME BUTTONS
========================= */

themeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                themeButtons.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                selectedTheme =
                    button.dataset.theme;

            }
        );

    }
);


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        tasks.filter(
            task => {

                if (
                    currentFilter ===
                    "pending"
                ) {
                    return !task.completed;
                }


                if (
                    currentFilter ===
                    "completed"
                ) {
                    return task.completed;
                }


                return true;

            }
        );


    /* EMPTY */

    if (
        filteredTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    +
                </div>

                <h3>
                    No notes here
                </h3>

                <p>
                    Click <b>+ New</b>
                    to write a note.
                </p>

            </div>

        `;


        updateCounts();

        return;
    }


    /* CREATE NOTES */

    filteredTasks.forEach(
        task => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `task-item ${
                    task.completed
                        ? "completed"
                        : ""
                }`;


            item.dataset.theme =
                task.theme || "cream";


            /* IMAGE */

            const imageHTML =
                task.image
                    ? `

                    <img
                        src="${escapeHTML(task.image)}"
                        alt="Note image"
                        class="task-image"
                        onerror="this.style.display='none'"
                    >

                    `
                    : "";


            /* TITLE */

            const titleHTML =
                task.title
                    ? `

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    `
                    : "";


            item.innerHTML = `

                <div class="task-content">

                    <input
                        type="checkbox"
                        class="task-check"
                        ${
                            task.completed
                                ? "checked"
                                : ""
                        }
                    >


                    <div class="task-details">

                        ${titleHTML}

                        <div class="task-text">
                            ${escapeHTML(task.text)}
                        </div>

                    </div>


                    ${imageHTML}

                </div>


                <div class="task-actions">

                    <button class="customize-btn">
                        Customize
                    </button>

                    <button class="delete-btn">
                        Delete
                    </button>

                </div>

            `;


            /* CHECKBOX */

            const checkbox =
                item.querySelector(
                    ".task-check"
                );


            checkbox.addEventListener(
                "change",
                () => {

                    task.completed =
                        checkbox.checked;

                    renderTasks();

                }
            );


            /* NOTE CLICK */

            item.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".task-check"
                        )
                    ) {
                        return;
                    }


                    if (
                        event.target.closest(
                            ".task-actions"
                        )
                    ) {
                        return;
                    }


                    openViewNote(task);

                }
            );


            /* CUSTOMIZE BUTTON */

            item.querySelector(
                ".customize-btn"
            ).addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openCustomize(task);

                }
            );


            /* DELETE */

            item.querySelector(
                ".delete-btn"
            ).addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    tasks =
                        tasks.filter(
                            item =>
                                item.id !==
                                task.id
                        );


                    renderTasks();

                }
            );


            taskList.appendChild(item);

        }
    );


    updateCounts();

}


/* =========================
   FILTER
========================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* =========================
   CLEAR COMPLETED
========================= */

clearCompleted.addEventListener(
    "click",
    () => {

        tasks =
            tasks.filter(
                task =>
                    !task.completed
            );


        renderTasks();

    }
);


/* =========================
   COUNTS
========================= */

function updateCounts() {

    const pending =
        tasks.filter(
            task => !task.completed
        ).length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    pendingCount.textContent =
        pending;


    completedCount.textContent =
        `${completed} completed`;

}


/* =========================
   SAFE TEXT
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================
   START
========================= */

renderTasks();