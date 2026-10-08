import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Admin.css";

export function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCompanies() {
            try {
                const response = await api.get("/companies");
                setCompanies(response.data.companies);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load companies"
                );
            } finally {
                setLoading(false);
            }
        }

        loadCompanies();
    }, []);

    if (loading) {
        return <div className="page-container">Loading companies...</div>;
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
                        <h1>Companies</h1>

                        <p>
                            Review organizations registered on the
                            Evident.ai platform.
                        </p>
                    </div>

                    <div className="admin-record-count">
                        {companies.length}{" "}
                        {companies.length === 1
                            ? "company"
                            : "companies"}
                    </div>

                </div>
            </div>

        </section>


        {companies.length === 0 ? (

            <div className="admin-empty">

                <div className="admin-empty-icon">
                    C
                </div>

                <h2>No companies found</h2>

                <p>
                    There are currently no registered organizations.
                </p>

            </div>

        ) : (

            <section className="admin-table-card">

                <div className="admin-card-header">

                    <div>
                        <span className="section-eyebrow">
                            ORGANIZATION DIRECTORY
                        </span>

                        <h2>Registered Companies</h2>

                        <p>
                            Organizations participating in ESG reporting.
                        </p>
                    </div>

                    <span className="admin-count">
                        {companies.length} records
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="data-table admin-table">

                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Registration Number</th>
                                <th>Industry</th>
                                <th>Country</th>
                                <th>Website</th>
                            </tr>
                        </thead>

                        <tbody>

                            {companies.map((company) => (

                                <tr key={company.id}>

                                    <td>
                                        <strong>
                                            {company.company_name}
                                        </strong>
                                    </td>

                                    <td>
                                        {company.registration_number}
                                    </td>

                                    <td>
                                        {company.industry || "—"}
                                    </td>

                                    <td>
                                        {company.country || "—"}
                                    </td>

                                    <td>

                                        {company.website ? (

                                            <a
                                                className="admin-external-link"
                                                href={company.website}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Visit →
                                            </a>

                                        ) : (
                                            "—"
                                        )}

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