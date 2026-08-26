import React, { useEffect, useState } from "react";

import {
    Check,
    X,
    Clock,
    CalendarDays,
    FileClock,
    RefreshCw
} from "lucide-react";

import {
    getSubmittedTimesheets,
    approveTimesheet,
    rejectTimesheet
} from "../../services/api";

import "./ManagerTimesheets.css";


function ManagerTimesheets() {

    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [processingId, setProcessingId] = useState(null);

    const [commentId, setCommentId] = useState(null);
    const [comment, setComment] = useState("");


    // =====================================================
    // LOAD TIMESHEETS
    // =====================================================

    const loadTimesheets = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getSubmittedTimesheets();

            setTimesheets(
                Array.isArray(data) ? data : []
            );

        } catch (err) {

            console.error("Timesheets error:", err);

            setError(
                err.message || "Failed to load timesheets"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadTimesheets();
    }, []);


    // =====================================================
    // APPROVE
    // =====================================================

    const handleApprove = async (id) => {

        try {

            setProcessingId(id);
            setError("");

            await approveTimesheet(id, "");

            setTimesheets((previous) =>
                previous.filter(
                    (item) => item.id !== id
                )
            );

        } catch (err) {

            console.error("Approve error:", err);

            setError(
                err.message ||
                "Failed to approve timesheet"
            );

        } finally {

            setProcessingId(null);

        }
    };


    // =====================================================
    // OPEN REJECT
    // =====================================================

    const openRejectBox = (id) => {

        setCommentId(id);
        setComment("");
        setError("");

    };


    // =====================================================
    // CANCEL REJECT
    // =====================================================

    const cancelReject = () => {

        setCommentId(null);
        setComment("");

    };


    // =====================================================
    // REJECT
    // =====================================================

    const handleReject = async (id) => {

        if (!comment.trim()) {

            setError(
                "Please enter a reason for rejection."
            );

            return;
        }

        try {

            setProcessingId(id);
            setError("");

            await rejectTimesheet(
                id,
                comment
            );

            setTimesheets((previous) =>
                previous.filter(
                    (item) => item.id !== id
                )
            );

            setCommentId(null);
            setComment("");

        } catch (err) {

            console.error("Reject error:", err);

            setError(
                err.message ||
                "Failed to reject timesheet"
            );

        } finally {

            setProcessingId(null);

        }
    };


    // =====================================================
    // TOTAL HOURS
    // =====================================================

    const totalHours =
        timesheets.reduce(
            (total, item) =>
                total +
                Number(item.hours || 0),
            0
        );


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="manager-timesheets-page">

            {/* HEADER */}

            <div className="manager-timesheets-header">

                <div>

                    <span className="manager-label">
                        MANAGER WORKSPACE
                    </span>

                    <h1>
                        Timesheet Approvals
                    </h1>

                    <p>
                        Review and approve employee timesheets.
                    </p>

                </div>


                <button
                    type="button"
                    className="refresh-timesheets-btn"
                    onClick={loadTimesheets}
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "refresh-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="manager-timesheet-error">
                    {error}
                </div>

            )}


            {/* SUMMARY */}

            <div className="manager-timesheet-summary">

                <div className="manager-summary-card">

                    <div className="manager-summary-icon">
                        <FileClock size={23} />
                    </div>

                    <div>

                        <span>
                            Pending Timesheets
                        </span>

                        <strong>
                            {timesheets.length}
                        </strong>

                    </div>

                </div>


                <div className="manager-summary-card">

                    <div className="manager-summary-icon">
                        <Clock size={23} />
                    </div>

                    <div>

                        <span>
                            Pending Hours
                        </span>

                        <strong>
                            {totalHours}h
                        </strong>

                    </div>

                </div>

            </div>


            {/* MAIN CARD */}

            <section className="manager-timesheets-card">

                <div className="manager-card-heading">

                    <h2>
                        Pending Timesheets
                    </h2>

                    <p>
                        Timesheets waiting for your approval
                    </p>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="manager-timesheet-empty">

                        <Clock size={45} />

                        <h3>
                            Loading timesheets...
                        </h3>

                        <p>
                            Please wait.
                        </p>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    timesheets.length === 0 && (

                        <div className="manager-timesheet-empty">

                            <Check size={48} />

                            <h3>
                                All caught up
                            </h3>

                            <p>
                                No submitted timesheets
                                are waiting for approval.
                            </p>

                        </div>

                    )}


                {/* LIST */}

                {!loading &&
                    timesheets.length > 0 && (

                        <div className="manager-timesheet-list">

                            {timesheets.map((timesheet) => (

                                <article
                                    className="manager-timesheet-row"
                                    key={timesheet.id}
                                >

                                    {/* INFORMATION */}

                                    <div className="timesheet-info-grid">


                                        {/* EMPLOYEE */}

                                        <div className="manager-employee-info">

                                            <div className="employee-avatar">

                                                U{timesheet.userId}

                                            </div>

                                            <div>

                                                <strong>
                                                    Employee #{timesheet.userId}
                                                </strong>

                                                <span>
                                                    User ID: {timesheet.userId}
                                                </span>

                                            </div>

                                        </div>


                                        {/* DATE */}

                                        <div className="manager-timesheet-date">

                                            <CalendarDays size={17} />

                                            <span>
                                                {timesheet.date ||
                                                    "No date"}
                                            </span>

                                        </div>


                                        {/* PROJECT */}

                                        <div className="manager-project-info">

                                            <strong>
                                                Project #{timesheet.projectId}
                                            </strong>

                                            <span>
                                                Task #{timesheet.taskId}
                                            </span>

                                        </div>


                                        {/* HOURS */}

                                        <div className="manager-hours">

                                            <strong>
                                                {timesheet.hours || 0}h
                                            </strong>

                                            <span>
                                                Logged Hours
                                            </span>

                                        </div>


                                        {/* DESCRIPTION */}

                                        <div className="manager-description">

                                            <strong>
                                                {timesheet.description ||
                                                    "No description provided."}
                                            </strong>

                                            <span>
                                                Submitted
                                            </span>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="manager-actions">

                                        <button
                                            type="button"
                                            className="approve-timesheet-btn"
                                            disabled={
                                                processingId ===
                                                timesheet.id
                                            }
                                            onClick={() =>
                                                handleApprove(
                                                    timesheet.id
                                                )
                                            }
                                        >

                                            <Check size={16} />

                                            {processingId === timesheet.id
                                                ? "Processing..."
                                                : "Approve"}

                                        </button>


                                        <button
                                            type="button"
                                            className="reject-timesheet-btn"
                                            disabled={
                                                processingId ===
                                                timesheet.id
                                            }
                                            onClick={() =>
                                                openRejectBox(
                                                    timesheet.id
                                                )
                                            }
                                        >

                                            <X size={16} />

                                            Reject

                                        </button>

                                    </div>


                                    {/* REJECT COMMENT */}

                                    {commentId === timesheet.id && (

                                        <div className="manager-comment-box">

                                            <textarea
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter reason for rejection..."
                                                rows={4}
                                                autoFocus
                                            />


                                            <div className="comment-actions">

                                                <button
                                                    type="button"
                                                    className="cancel-comment-btn"
                                                    onClick={
                                                        cancelReject
                                                    }
                                                >
                                                    Cancel
                                                </button>


                                                <button
                                                    type="button"
                                                    className="confirm-reject-btn"
                                                    disabled={
                                                        processingId ===
                                                        timesheet.id
                                                    }
                                                    onClick={() =>
                                                        handleReject(
                                                            timesheet.id
                                                        )
                                                    }
                                                >

                                                    {processingId ===
                                                    timesheet.id
                                                        ? "Rejecting..."
                                                        : "Confirm Reject"}

                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </article>

                            ))}

                        </div>

                    )}

            </section>

        </div>
    );
}


export default ManagerTimesheets;