import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDisclosures, createDisclosure } from "../api/disclosureApi.js";

export function Disclosures() {
    const [disclosures, setDisclosures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [reportingYearInput, setReportingYearInput] = useState("");

    const currentYear = new Date().getFullYear();

    const currentD = disclosures.find(
        (d) => Number(d.reporting_year) === currentYear
    );

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const year = Number(reportingYearInput);

            await createDisclosure(year);

            const data = await getDisclosures();
            setDisclosures(data.disclosures);

            setReportingYearInput("");
            setShowForm(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create disclosure"
            );
        }
    }

    useEffect(() => {
        async function loadDisclosures() {
            try {
                const data = await getDisclosures();
                setDisclosures(data.disclosures);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load disclosures"
                );
            } finally {
                setLoading(false);
            }
        }

        loadDisclosures();
    }, []);

    if (loading) {
        return (
            <div className="page-state">
                <div className="loading-spinner"></div>
                <p>Loading disclosures...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-state error-state">
                <div className="state-icon">!</div>
                <h2>Unable to load disclosures</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            {/* PAGE HEADER */}
            <div className="page-header">
                <div>
                    <span className="page-eyebrow">
                        ESG REPORTING
                    </span>

                    <h1>My Disclosures</h1>

                    <p>
                        Prepare, manage and submit your organization's
                        annual ESG disclosures.
                    </p>
                </div>

                {!currentD && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <span className="btn-icon">+</span>
                        Create Disclosure
                    </button>
                )}
            </div>


            {/* CREATE DISCLOSURE FORM */}
            {showForm && (
                <section className="create-disclosure-card">

                    <div className="create-card-header">
                        <div>
                            <span className="section-eyebrow">
                                NEW REPORT
                            </span>

                            <h2>Create a Disclosure</h2>

                            <p>
                                Start a new ESG reporting period for your
                                organization.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="icon-close"
                            onClick={() => {
                                setShowForm(false);
                                setReportingYearInput("");
                            }}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="create-form">

                        <div className="form-field">
                            <label htmlFor="reportingYear">
                                Reporting Year
                            </label>

                            <input
                                id="reportingYear"
                                name="reportingYear"
                                type="number"
                                placeholder="e.g. 2026"
                                value={reportingYearInput}
                                onChange={(e) =>
                                    setReportingYearInput(e.target.value)
                                }
                                required
                            />

                            <span className="field-help">
                                Enter the year this ESG disclosure covers.
                            </span>
                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowForm(false);
                                    setReportingYearInput("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Create Disclosure
                            </button>

                        </div>

                    </form>
                </section>
            )}


            {/* CURRENT DRAFT */}
            {currentD?.status === "DRAFT" && (
                <div className="draft-banner">

                    <div className="draft-banner-content">
                        <div className="draft-icon">✦</div>

                        <div>
                            <strong>
                                Your {currentYear} disclosure is still in draft
                            </strong>

                            <p>
                                Continue adding data and evidence before
                                submitting it for audit.
                            </p>
                        </div>
                    </div>

                    <Link
                        to={`/disclosures/${currentD.id}`}
                        className="btn btn-primary"
                    >
                        Continue Draft →
                    </Link>

                </div>
            )}


            {/* DISCLOSURE TABLE */}
            <section className="content-card">

                <div className="content-card-header">
                    <div>
                        <h2>Disclosure History</h2>
                        <p>
                            Your organization's ESG reporting records
                        </p>
                    </div>

                    <span className="record-count">
                        {disclosures.length}{" "}
                        {disclosures.length === 1
                            ? "disclosure"
                            : "disclosures"}
                    </span>
                </div>


                {disclosures.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            ◇
                        </div>

                        <h3>No disclosures yet</h3>

                        <p>
                            Create your first ESG disclosure to begin
                            reporting.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            Create Disclosure
                        </button>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>Reporting Year</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th className="table-action-heading">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {disclosures.map((disclosure) => (

                                    <tr key={disclosure.id}>

                                        <td>
                                            <span className="year-cell">
                                                {disclosure.reporting_year}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge status-${(
                                                    disclosure.status || "unknown"
                                                )
                                                    .toLowerCase()
                                                    .replaceAll("_", "-")}`}
                                            >
                                                {disclosure.status || "Unknown"}
                                            </span>
                                        </td>

                                        <td className="date-cell">
                                            {new Date(
                                                disclosure.created_at
                                            ).toLocaleDateString(
                                                undefined,
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </td>

                                        <td className="table-action">

                                            <Link
                                                to={`${disclosure.id}`}
                                                className="table-link"
                                            >
                                                View
                                                <span>→</span>
                                            </Link>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
}