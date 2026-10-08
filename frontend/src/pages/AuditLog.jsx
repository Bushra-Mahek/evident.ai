import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Admin.css";

export function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLogs() {
            try {
                const response = await api.get("/audit-logs");
                setLogs(response.data.logs);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load audit logs"
                );
            } finally {
                setLoading(false);
            }
        }

        loadLogs();
    }, []);

    if (loading) {
        return <div className="page-container">Loading audit logs...</div>;
    }

    if (error) {
        return <div className="page-container">{error}</div>;
    }

    return (
    <div className="admin-page">

        <section className="admin-header">

            <div>
                <span className="page-eyebrow">
                    PLATFORM ADMINISTRATION
                </span>

                <div className="admin-title-row">

                    <div>
                        <h1>Audit Logs</h1>

                        <p>
                            Review platform actions and security-related
                            events.
                        </p>
                    </div>

                    <div className="admin-record-count">
                        {logs.length}{" "}
                        {logs.length === 1 ? "event" : "events"}
                    </div>

                </div>
            </div>

        </section>


        {logs.length === 0 ? (

            <div className="admin-empty">

                <div className="admin-empty-icon">
                    A
                </div>

                <h2>No audit logs found</h2>

                <p>
                    No platform activity has been recorded.
                </p>

            </div>

        ) : (

            <section className="admin-table-card audit-log-card">

                <div className="admin-card-header">

                    <div>
                        <span className="section-eyebrow">
                            SECURITY ACTIVITY
                        </span>

                        <h2>Platform Audit Trail</h2>

                        <p>
                            Recorded actions performed across the platform.
                        </p>
                    </div>

                    <span className="admin-count">
                        {logs.length} events
                    </span>

                </div>


                <div className="table-wrapper audit-log-wrapper">

                    <table className="data-table admin-table audit-log-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Entity ID</th>
                                <th>IP Address</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>

                        <tbody>

                            {logs.map((log) => (

                                <tr key={log.id}>

                                    <td>

                                        <div className="audit-user">

                                            <strong>
                                                {log.user_name || "System"}
                                            </strong>

                                            {log.user_email && (
                                                <span>
                                                    {log.user_email}
                                                </span>
                                            )}

                                        </div>

                                    </td>


                                    <td>
                                        <span className="admin-role-badge">
                                            {log.user_role || "—"}
                                        </span>
                                    </td>


                                    <td>
                                        <span className="audit-action">
                                            {log.action}
                                        </span>
                                    </td>


                                    <td>
                                        {log.entity_type}
                                    </td>


                                    <td>
                                        <code className="audit-entity-id">
                                            {log.entity_id || "—"}
                                        </code>
                                    </td>


                                    <td>
                                        <code className="audit-ip">
                                            {log.ip_address || "—"}
                                        </code>
                                    </td>


                                    <td className="audit-timestamp">
                                        {log.created_at
                                            ? new Date(
                                                log.created_at
                                            ).toLocaleString()
                                            : "—"}
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