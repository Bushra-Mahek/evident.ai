import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Companies</h1>
                    <p>Review registered organizations on the platform.</p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
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
                        {companies.length === 0 ? (
                            <tr>
                                <td colSpan="5">No companies found.</td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr key={company.id}>
                                    <td>{company.company_name}</td>
                                    <td>{company.registration_number}</td>
                                    <td>{company.industry || "—"}</td>
                                    <td>{company.country || "—"}</td>
                                    <td>
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Visit
                                            </a>
                                        ) : (
                                            "—"
                                        )}
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