import { useEffect, useState } from "react";

import {
    Plus,
    Send,
    Trash2,
    Clock,
    CalendarDays,
    MessageSquare
} from "lucide-react";

import {
    getEmployeeTimesheets,
    createTimesheet,
    submitTimesheet,
    updateTimesheet,
    deleteTimesheet
} from "../services/api";

import "./Timesheets.css";


function Timesheets() {

    const [timesheets, setTimesheets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    // ID of rejected timesheet currently being edited
    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");


    const [form, setForm] = useState({
        projectId: "",
        taskId: "",
        date: new Date()
            .toISOString()
            .split("T")[0],
        hours: "",
        description: "",
        billable: true,
        remarks: ""
    });


    // =====================================================
    // LOAD TIMESHEETS
    // =====================================================

    useEffect(() => {
        loadTimesheets();
    }, []);


    async function loadTimesheets() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getEmployeeTimesheets();

            setTimesheets(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to load timesheets"
            );

        } finally {

            setLoading(false);

        }
    }


    // =====================================================
    // FORM CHANGE
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setForm(previous => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

    }


    // =====================================================
    // EDIT REJECTED TIMESHEET
    // =====================================================

    function handleEditRejected(item) {

        setEditingId(item.id);

        setForm({

            projectId:
                item.projectId || "",

            taskId:
                item.taskId || "",

            date:
                item.date || "",

            hours:
                item.hours || "",

            description:
                item.description || "",

            billable:
                item.billable ?? true,

            remarks:
                item.remarks || ""

        });

        setShowForm(true);

        setError("");

        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // CANCEL FORM
    // =====================================================

    function handleCancelForm() {

        setShowForm(false);

        setEditingId(null);

        setForm({

            projectId: "",
            taskId: "",

            date:
                new Date()
                    .toISOString()
                    .split("T")[0],

            hours: "",
            description: "",
            billable: true,
            remarks: ""

        });

        setError("");

    }


    // =====================================================
    // CREATE / UPDATE TIMESHEET
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");


            // Required fields

            if (
                !form.projectId ||
                !form.taskId ||
                !form.date ||
                !form.hours
            ) {

                setError(
                    "Please fill all required fields."
                );

                return;
            }


            const timesheetData = {

                projectId:
                    Number(form.projectId),

                taskId:
                    Number(form.taskId),

                date:
                    form.date,

                hours:
                    Number(form.hours),

                description:
                    form.description,

                billable:
                    form.billable,

                remarks:
                    form.remarks

            };


            // =================================================
            // UPDATE REJECTED TIMESHEET
            // =================================================

            if (editingId !== null) {

                const updatedTimesheet =
                    await updateTimesheet(
                        editingId,
                        timesheetData
                    );


                setTimesheets(previous =>
                    previous.map(item =>
                        item.id === editingId
                            ? updatedTimesheet
                            : item
                    )
                );


                setEditingId(null);

            }

            // =================================================
            // CREATE NEW TIMESHEET
            // =================================================

            else {

                const newTimesheet =
                    await createTimesheet(
                        timesheetData
                    );


                setTimesheets(previous => [
                    newTimesheet,
                    ...previous
                ]);

            }


            // Reset form

            setForm({

                projectId: "",
                taskId: "",

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                hours: "",
                description: "",
                billable: true,
                remarks: ""

            });


            setShowForm(false);


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to save timesheet"
            );

        } finally {

            setSaving(false);

        }

    }


    // =====================================================
    // SUBMIT TIMESHEET
    // =====================================================

    async function handleSubmitTimesheet(id) {

        try {

            setError("");

            const updated =
                await submitTimesheet(id);


            setTimesheets(previous =>
                previous.map(item =>
                    item.id === id
                        ? updated
                        : item
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to submit timesheet"
            );

        }

    }


    // =====================================================
    // DELETE TIMESHEET
    // =====================================================

    async function handleDelete(id) {

        const confirmed =
            window.confirm(
                "Delete this timesheet?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteTimesheet(id);


            setTimesheets(previous =>
                previous.filter(
                    item =>
                        item.id !== id
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to delete timesheet"
            );

        }

    }


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalHours =
        timesheets.reduce(
            (total, item) =>
                total +
                Number(item.hours || 0),
            0
        );


    const submittedCount =
        timesheets.filter(
            item =>
                item.status === "SUBMITTED"
        ).length;


    const approvedCount =
        timesheets.filter(
            item =>
                item.status === "APPROVED"
        ).length;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="timesheets-page">

                <div className="timesheets-loading">
                    Loading timesheets...
                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="timesheets-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="timesheets-header">

                <div>

                    <h1>
                        Timesheets
                    </h1>

                    <p>
                        Track and submit your working hours
                    </p>

                </div>


                <button
                    type="button"
                    className="add-timesheet-button"
                    onClick={() => {

                        if (showForm) {

                            handleCancelForm();

                        } else {

                            setShowForm(true);
                            setEditingId(null);

                        }

                    }}
                >

                    <Plus size={18} />

                    {showForm
                        ? "Close"
                        : "Add Timesheet"}

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="timesheet-error">
                    {error}
                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="timesheet-summary">


                <div className="summary-card">

                    <Clock size={22} />

                    <div>

                        <span>
                            Total Hours
                        </span>

                        <strong>
                            {totalHours}h
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <Send size={22} />

                    <div>

                        <span>
                            Submitted
                        </span>

                        <strong>
                            {submittedCount}
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <CalendarDays size={22} />

                    <div>

                        <span>
                            Approved
                        </span>

                        <strong>
                            {approvedCount}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <div
                    className={`timesheet-form-card ${
                        editingId !== null
                            ? "editing"
                            : ""
                    }`}
                >

                    <div className="form-heading">

                        <h2>

                            {editingId !== null
                                ? "Edit Rejected Timesheet"
                                : "Add Timesheet"}

                        </h2>


                        <p>

                            {editingId !== null

                                ? "Correct the rejected entry and save it for resubmission."

                                : "Enter the hours you worked"}

                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="timesheet-form"
                    >


                        {/* PROJECT */}

                        <div className="form-group">

                            <label>
                                Project ID *
                            </label>

                            <input
                                type="number"
                                name="projectId"
                                value={form.projectId}
                                onChange={handleChange}
                                placeholder="Enter project ID"
                            />

                        </div>


                        {/* TASK */}

                        <div className="form-group">

                            <label>
                                Task ID *
                            </label>

                            <input
                                type="number"
                                name="taskId"
                                value={form.taskId}
                                onChange={handleChange}
                                placeholder="Enter task ID"
                            />

                        </div>


                        {/* DATE */}

                        <div className="form-group">

                            <label>
                                Date *
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                            />

                        </div>


                        {/* HOURS */}

                        <div className="form-group">

                            <label>
                                Hours *
                            </label>

                            <input
                                type="number"
                                name="hours"
                                value={form.hours}
                                onChange={handleChange}
                                placeholder="e.g. 8"
                                min="0"
                                max="24"
                                step="0.5"
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="What did you work on?"
                                rows="4"
                            />

                        </div>


                        {/* REMARKS */}

                        <div className="form-group full-width">

                            <label>
                                Remarks
                            </label>

                            <textarea
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                placeholder="Optional remarks"
                                rows="3"
                            />

                        </div>


                        {/* BILLABLE */}

                        <label className="billable-checkbox">

                            <input
                                type="checkbox"
                                name="billable"
                                checked={form.billable}
                                onChange={handleChange}
                            />

                            Billable hours

                        </label>


                        {/* FORM BUTTONS */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    handleCancelForm
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-button"
                                disabled={saving}
                            >

                                {saving

                                    ? "Saving..."

                                    : editingId !== null

                                        ? "Save Changes"

                                        : "Save Timesheet"}

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =================================================
                TIMESHEET LIST
            ================================================= */}

            <div className="timesheet-list-card">

                <div className="list-heading">

                    <h2>
                        My Timesheets
                    </h2>

                    <p>
                        Your recent time entries
                    </p>

                </div>


                {timesheets.length === 0 ? (

                    <div className="empty-timesheets">

                        <Clock size={35} />

                        <h3>
                            No timesheets yet
                        </h3>

                        <p>
                            Add your first timesheet entry.
                        </p>

                    </div>

                ) : (

                    <div className="timesheet-list">

                        {timesheets.map(item => {

                            const status =
                                String(
                                    item.status ||
                                    "DRAFT"
                                ).toLowerCase();


                            const isRejected =
                                status === "rejected";


                            return (

                                <div
                                    className={`timesheet-entry ${
                                        isRejected
                                            ? "rejected-entry"
                                            : ""
                                    }`}
                                    key={item.id}
                                >


                                    {/* =================================================
                                        TIMESHEET ROW
                                    ================================================= */}

                                    <div className="timesheet-row">


                                        {/* DATE */}

                                        <div className="timesheet-date">

                                            <CalendarDays
                                                size={18}
                                            />

                                            <span>
                                                {item.date}
                                            </span>

                                        </div>


                                        {/* PROJECT / TASK */}

                                        <div className="timesheet-info">

                                            <strong>
                                                Project #{item.projectId}
                                            </strong>

                                            <span>
                                                Task #{item.taskId}
                                            </span>

                                        </div>


                                        {/* HOURS */}

                                        <div className="timesheet-hours">

                                            <strong>
                                                {item.hours}h
                                            </strong>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`timesheet-status ${status}`}
                                        >
                                            {item.status}
                                        </span>


                                        {/* ACTIONS */}

                                        <div className="timesheet-actions">


                                            {/* EDIT REJECTED */}

                                            {item.status ===
                                                "REJECTED" && (

                                                <button
                                                    type="button"
                                                    className="edit-timesheet-button"
                                                    onClick={() =>
                                                        handleEditRejected(
                                                            item
                                                        )
                                                    }
                                                >
                                                    Edit & Resubmit
                                                </button>

                                            )}


                                            {/* SUBMIT DRAFT */}

                                            {item.status ===
                                                "DRAFT" && (

                                                <button
                                                    type="button"
                                                    className="submit-timesheet-button"
                                                    onClick={() =>
                                                        handleSubmitTimesheet(
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    <Send
                                                        size={15}
                                                    />

                                                    Submit

                                                </button>

                                            )}


                                            {/* DELETE DRAFT */}

                                            {item.status ===
                                                "DRAFT" && (

                                                <button
                                                    type="button"
                                                    className="delete-timesheet-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    <Trash2
                                                        size={16}
                                                    />

                                                </button>

                                            )}

                                        </div>

                                    </div>


                                    {/* =================================================
                                        REJECTION COMMENT
                                    ================================================= */}

                                    {isRejected &&
                                        item.managerComment && (

                                        <div className="manager-comment">

                                            <div className="manager-comment-icon">

                                                <MessageSquare
                                                    size={18}
                                                />

                                            </div>


                                            <div>

                                                <strong>
                                                    Manager's Comment
                                                </strong>

                                                <p>
                                                    {item.managerComment}
                                                </p>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

}


export default Timesheets;