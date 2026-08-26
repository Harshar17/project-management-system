import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Circle,
    CircleCheck,
    Loader2
} from "lucide-react";

import {
    getEmployeeTasks,
    updateTaskStatus
} from "../services/api";

import "./Tasks.css";


function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [error, setError] = useState("");


    // ========================================
    // LOAD TASKS
    // ========================================

    useEffect(() => {

        loadTasks();

    }, []);


    const loadTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getEmployeeTasks();

            console.log("EMPLOYEE TASKS:", data);

            setTasks(data);

        } catch (error) {

            console.error(
                "LOAD TASKS ERROR:",
                error
            );

            setError(
                error.message ||
                "Failed to load tasks"
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // CHANGE TASK STATUS
    // ========================================

    const handleStatusChange = async (task) => {

        console.log("================================");
        console.log("CLICKED TASK:", task);
        console.log("TASK ID:", task.id);
        console.log("OLD STATUS:", task.status);
        console.log("================================");


        try {

            setUpdatingTaskId(task.id);
            setError("");


            // TODO -> COMPLETED
            // COMPLETED -> TODO

            const newStatus =
                task.status === "COMPLETED"
                    ? "TODO"
                    : "COMPLETED";


            console.log(
                "NEW STATUS:",
                newStatus
            );


            // Call Spring Boot API

            const updatedTask =
                await updateTaskStatus(
                    task.id,
                    newStatus
                );


            console.log(
                "UPDATED TASK FROM BACKEND:",
                updatedTask
            );


            // Update React state

            setTasks((previousTasks) => {

                return previousTasks.map(
                    (item) => {

                        if (
                            item.id ===
                            updatedTask.id
                        ) {

                            return updatedTask;

                        }

                        return item;

                    }
                );

            });


        } catch (error) {

            console.error(
                "UPDATE TASK ERROR:",
                error
            );

            setError(
                error.message ||
                "Failed to update task"
            );

        } finally {

            setUpdatingTaskId(null);

        }
    };


    // ========================================
    // PRIORITY CLASS
    // ========================================

    const getPriorityClass = (priority) => {

        if (!priority) {
            return "";
        }

        return priority
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="tasks-page">

                <div className="tasks-loading">

                    <Loader2
                        size={28}
                        className="loading-spinner"
                    />

                    <p>
                        Loading your tasks...
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="tasks-page">


            {/* ========================================
                BACK TO DASHBOARD
            ======================================== */}

            <button
                type="button"
                className="back-button"
                onClick={() =>
                    window.history.back()
                }
            >

                <ArrowLeft size={18} />

                <span>
                    Dashboard
                </span>

            </button>


            {/* ========================================
                PAGE HEADER
            ======================================== */}

            <div className="tasks-header">

                <div>

                    <h1>
                        My Tasks
                    </h1>

                    <p>
                        Tasks assigned to you
                    </p>

                </div>


                <div className="task-count">

                    {tasks.length}

                </div>

            </div>


            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

            {error && (

                <div className="task-error">

                    {error}

                </div>

            )}


            {/* ========================================
                MAIN CARD
            ======================================== */}

            <div className="tasks-card">


                {/* CARD HEADER */}

                <div className="card-header">

                    <div>

                        <h2>
                            My Tasks
                        </h2>

                        <p>
                            Tasks assigned to you in this project
                        </p>

                    </div>


                    <span className="total-task-count">

                        {tasks.length}

                    </span>

                </div>


                {/* ========================================
                    NO TASKS
                ======================================== */}

                {tasks.length === 0 ? (

                    <div className="empty-tasks">

                        <p>
                            No tasks assigned to you.
                        </p>

                    </div>

                ) : (


                    /* ========================================
                       TASK LIST
                    ======================================== */

                    <div className="task-list">


                        {tasks.map((task) => {

                            const completed =
                                task.status ===
                                "COMPLETED";


                            const updating =
                                updatingTaskId ===
                                task.id;


                            return (

                                <div
                                    className={
                                        `task-item ${
                                            completed
                                                ? "task-item-completed"
                                                : ""
                                        }`
                                    }
                                    key={task.id}
                                >


                                    {/* ========================================
                                        CHECKBOX
                                    ======================================== */}

                                    <button
                                        type="button"
                                        className="task-check-button"
                                        onClick={() => {

                                            console.log(
                                                "BUTTON CLICKED"
                                            );

                                            handleStatusChange(
                                                task
                                            );

                                        }}
                                        disabled={updating}
                                    >

                                        {updating ? (

                                            <Loader2
                                                size={23}
                                                className="loading-spinner"
                                            />

                                        ) : completed ? (

                                            <CircleCheck
                                                size={23}
                                                className="task-completed"
                                            />

                                        ) : (

                                            <Circle
                                                size={23}
                                                className="task-pending"
                                            />

                                        )}

                                    </button>


                                    {/* ========================================
                                        TASK DETAILS
                                    ======================================== */}

                                    <div className="task-content">

                                        <strong
                                            className={
                                                completed
                                                    ? "completed-task"
                                                    : ""
                                            }
                                        >
                                            {task.name}
                                        </strong>


                                        {task.description && (

                                            <span>
                                                {task.description}
                                            </span>

                                        )}


                                        {task.projectId && (

                                            <small>
                                                Project ID:{" "}
                                                {task.projectId}
                                            </small>

                                        )}

                                    </div>


                                    {/* ========================================
                                        PRIORITY
                                    ======================================== */}

                                    {task.priority && (

                                        <span
                                            className={
                                                `task-priority ${
                                                    getPriorityClass(
                                                        task.priority
                                                    )
                                                }`
                                            }
                                        >

                                            {task.priority}

                                        </span>

                                    )}


                                    {/* ========================================
                                        STATUS
                                    ======================================== */}

                                    <span
                                        className={
                                            `task-status ${
                                                completed
                                                    ? "completed-status"
                                                    : "todo-status"
                                            }`
                                        }
                                    >

                                        {task.status ||
                                            "TODO"}

                                    </span>


                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

}


export default Tasks;