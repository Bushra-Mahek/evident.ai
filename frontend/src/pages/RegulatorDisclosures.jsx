import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export function RegulatorDisclosures() {
    const [disclosures, setDisclosures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDisclosures() {
            try {
                const response = await api.get("/disclosures");
                setDisclosures(response.data.disclosures);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load disclosures"
                );
            } finally {
                setLoading(false);
            }
        }

        loadDisclosures();
    }, []);

    if (loading) {
        return <div className="page-container">Loading disclosures...</div>;
    }

    if (error) {
        return <div className="page-container">{error}</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Disclosures</h1>
                    <p>
                        Review submitted ESG disclosures and their
                        verification status.
                    </p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Reporting Year</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {disclosures.length === 0 ? (
                            <tr>
                                <td colSpan="5">
                                    No submitted disclosures found.
                                </td>
                            </tr>
                        ) : (
                            disclosures.map((disclosure) => (
                                <tr key={disclosure.id}>
                                    <td>
                                        {disclosure.company_name || "—"}
                                    </td>

                                    <td>
                                        {disclosure.reporting_year}
                                    </td>

                                    <td>
                                        {disclosure.status}
                                    </td>

                                    <td>
                                        {disclosure.created_at
                                            ? new Date(
                                                  disclosure.created_at
                                              ).toLocaleString()
                                            : "—"}
                                    </td>

                                    <td>
                                        <Link
                                            to={`/regulator/disclosures/${disclosure.id}`}
                                        >
                                            View
                                        </Link>
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
