import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDisclosureTimeline } from "../api/reviewApi.js";

export function AuditHistoryDetail() {
    const { disclosureId } = useParams();

    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTimeline();
    }, [disclosureId]);

    async function loadTimeline() {
        try {
            setLoading(true);

            const data = await getDisclosureTimeline(disclosureId);

            setTimeline(data.timeline || []);
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

    function formatDate(date) {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    }

    if (loading) {
        return <p>Loading audit timeline...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Disclosure Audit Timeline</h2>

            <Link to="/audit-history">
                ← Back to Audit History
            </Link>

            <br />
            <br />

            {timeline.length === 0 ? (
                <p>No audit history available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Previous Status</th>
                            <th>New Status</th>
                            <th>Actor</th>
                            <th>Role</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {timeline.map((event) => (
                            <tr key={event.id}>
                                <td>{event.action}</td>

                                <td>
                                    {event.old_status || "-"}
                                </td>

                                <td>
                                    {event.new_status || "-"}
                                </td>

                                <td>
                                    {event.actor_name || "-"}
                                </td>

                                <td>
                                    {event.actor_role || "-"}
                                </td>

                                <td>
                                    {formatDate(event.created_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AuditHistoryDetail;