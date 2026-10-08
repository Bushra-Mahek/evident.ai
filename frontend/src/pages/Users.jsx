import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage and review registered platform users.</p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Company</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.company_name || "Platform"}
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

