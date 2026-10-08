import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

import "./Admin.css";

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await api.get("/users");
                setUsers(response.data.users);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load users"
                );
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    if (loading) {
        return <div className="page-container">Loading users...</div>;
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
                        <h1>Users</h1>

                        <p>
                            Review registered users and their platform access.
                        </p>
                    </div>

                    <div className="admin-record-count">
                        {users.length}{" "}
                        {users.length === 1 ? "user" : "users"}
                    </div>

                </div>
            </div>

        </section>


        {users.length === 0 ? (

            <div className="admin-empty">

                <div className="admin-empty-icon">
                    U
                </div>

                <h2>No users found</h2>

                <p>
                    There are currently no registered platform users.
                </p>

            </div>

        ) : (

            <section className="admin-table-card">

                <div className="admin-card-header">

                    <div>
                        <span className="section-eyebrow">
                            USER DIRECTORY
                        </span>

                        <h2>Registered Users</h2>

                        <p>
                            Platform accounts and assigned access roles.
                        </p>
                    </div>

                    <span className="admin-count">
                        {users.length} records
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="data-table admin-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Company</th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.map((user) => (

                                <tr key={user.id}>

                                    <td>
                                        <strong>
                                            {user.full_name}
                                        </strong>
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        <span
                                            className={`admin-role-badge role-${user.role.toLowerCase()}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        {user.company_name || "Platform"}
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