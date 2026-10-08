import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Audit Logs</h1>
                    <p>
                        Review platform actions and security-related events.
                    </p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
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
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="7">
                                    No audit logs found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <div>{log.user_name || "System"}</div>
                                        {log.user_email && (
                                            <small>{log.user_email}</small>
                                        )}
                                    </td>

                                    <td>
                                        {log.user_role || "—"}
                                    </td>

                                    <td>
                                        {log.action}
                                    </td>

                                    <td>
                                        {log.entity_type}
                                    </td>

                                    <td>
                                        {log.entity_id || "—"}
                                    </td>

                                    <td>
                                        {log.ip_address || "—"}
                                    </td>

                                    <td>
                                        {log.created_at
                                            ? new Date(
                                                  log.created_at
                                              ).toLocaleString()
                                            : "—"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
