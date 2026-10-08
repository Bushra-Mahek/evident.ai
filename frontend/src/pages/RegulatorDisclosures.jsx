import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import "./Regulator.css";

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
    <div className="regulator-page">

        <section className="regulator-header">

            <div>
                <span className="page-eyebrow">
                    REGULATORY OVERSIGHT
                </span>

                <div className="regulator-title-row">

                    <div>
                        <h1>Disclosures</h1>

                        <p>
                            Review submitted ESG disclosures and their
                            verification status.
                        </p>
                    </div>

                    <div className="regulator-record-count">
                        {disclosures.length}{" "}
                        {disclosures.length === 1
                            ? "record"
                            : "records"}
                    </div>

                </div>
            </div>

        </section>


        {disclosures.length === 0 ? (

            <div className="regulator-empty">

                <div className="regulator-empty-icon">
                    —
                </div>

                <h2>No disclosures available</h2>

                <p>
                    No submitted ESG disclosures are currently
                    available for regulatory review.
                </p>

            </div>

        ) : (

            <section className="regulator-table-card">

                <div className="regulator-card-header">

                    <div>
                        <span className="section-eyebrow">
                            DISCLOSURE RECORDS
                        </span>

                        <h2>Submitted Disclosures</h2>

                        <p>
                            Read-only regulatory access to submitted
                            company disclosures.
                        </p>
                    </div>

                    <span className="auditor-count">
                        {disclosures.length} records
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="data-table regulator-table">

                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Reporting Year</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {disclosures.map((disclosure) => (

                                <tr key={disclosure.id}>

                                    <td>
                                        <strong>
                                            {disclosure.company_name || "—"}
                                        </strong>
                                    </td>

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
                                        {disclosure.created_at
                                            ? new Date(
                                                disclosure.created_at
                                            ).toLocaleString()
                                            : "—"}
                                    </td>

                                    <td className="regulator-action-cell">

                                        <Link
                                            className="table-link"
                                            to={`/regulator/disclosures/${disclosure.id}`}
                                        >
                                            View Disclosure →
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