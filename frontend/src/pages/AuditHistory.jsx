import React, { useEffect, useState } from "react";
import { getCompletedReviews } from "../api/reviewApi.js";
import { Link } from "react-router-dom";

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
        <div>
            <h2>Audit History</h2>

            {disclosures.length === 0 ? (
                <p>No completed reviews found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Reporting Year</th>
                            <th>Status</th>
                            <th>Submitted At</th>
                            <th>Completed At</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {disclosures.map((disclosure) => (
                            <tr key={disclosure.id}>
                                <td>{disclosure.reporting_year}</td>

                                <td>
                                    {disclosure.status}
                                </td>

                                <td>
                                    {formatDate(disclosure.submitted_at)}
                                </td>

                                <td>
                                    {disclosure.status === "VERIFIED"
    ? formatDate(disclosure.verified_at)
    : disclosure.status === "REJECTED"
    ? formatDate(disclosure.rejected_at)
    : "-"}
                                </td>

                                <td>
                                    <Link
                                        to={`/audit-history/${disclosure.id}`}
                                    >
                                        View History
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AuditHistory;