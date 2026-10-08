import React, { useEffect, useState } from "react";
import { getCompletedReviews } from "../api/reviewApi.js";
import { Link } from "react-router-dom";
import "./Auditor.css";

export function AuditHistory() {
    const [disclosures, setDisclosures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    function formatDate(date) {
    if (!date || date === 0) {
        return "-";
    }

    return new Date(date).toLocaleString();
}

    async function loadHistory() {
        try {
            setLoading(true);

            const data = await getCompletedReviews();

            setDisclosures(data.disclosures || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load audit history"
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Loading audit history...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
    <div className="auditor-page">

        <section className="review-header">

            <div>

                <span className="page-eyebrow">
                    AUDITOR WORKSPACE
                </span>

                <div className="review-title-row">

                    <div>
                        <h1>Audit History</h1>

                        <p>
                            Review the completed verification history
                            of ESG disclosures processed by auditors.
                        </p>
                    </div>

                    <div className="audit-history-count">
                        {disclosures.length} completed
                    </div>

                </div>

            </div>

        </section>


        {disclosures.length === 0 ? (

            <div className="auditor-empty audit-history-empty">
                No completed reviews found.
            </div>

        ) : (

            <section className="history-card">

                <div className="history-card-header">

                    <div>
                        <span className="section-eyebrow">
                            COMPLETED REVIEWS
                        </span>

                        <h2>Verification Records</h2>
                    </div>

                    <span className="auditor-count">
                        {disclosures.length} records
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="data-table auditor-history-table">

                        <thead>
                            <tr>
                                <th>Reporting Year</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Completed</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {disclosures.map((disclosure) => (

                                <tr key={disclosure.id}>

                                    <td>
                                        <strong>
                                            {disclosure.reporting_year}
                                        </strong>
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge status-${disclosure.status.toLowerCase()}`}
                                        >
                                            <span className="status-dot"></span>
                                            {disclosure.status}
                                        </span>
                                    </td>

                                    <td>
                                        {formatDate(
                                            disclosure.submitted_at
                                        )}
                                    </td>

                                    <td>
                                        {disclosure.status === "VERIFIED"
                                            ? formatDate(
                                                disclosure.verified_at
                                            )
                                            : disclosure.status === "REJECTED"
                                                ? formatDate(
                                                    disclosure.rejected_at
                                                )
                                                : "-"}
                                    </td>

                                    <td className="history-action-cell">

                                        <Link
                                            className="table-link"
                                            to={`/audit-history/${disclosure.id}`}
                                        >
                                            View History →
                                        </Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </section>

        )}

    </div>
)};