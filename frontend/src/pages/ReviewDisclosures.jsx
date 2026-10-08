import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getPendingReviews
} from "../api/reviewApi.js";
import "./Auditor.css";

export function ReviewDisclosures() {

    const [disclosures, setDisclosures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadReviews() {

            try {

                const data = await getPendingReviews();

                setDisclosures(data.disclosures || []);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load pending reviews"
                );

            } finally {

                setLoading(false);

            }
        }

        loadReviews();

    }, []);


    if (loading) {
        return <p>Loading pending reviews...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
    <div className="auditor-page">

        <section className="review-header">

            <div>

                <span className="page-eyebrow">
                    AUDITOR WORKSPACE
                </span>

                <div className="review-title-row">

                    <div>

                        <h1>Pending Disclosure Reviews</h1>

                        <p>
                            Review ESG disclosures submitted by companies
                            that are awaiting auditor verification.
                        </p>

                    </div>

                    <div className="audit-history-count">
                        {disclosures.length}{" "}
                        {disclosures.length === 1
                            ? "pending review"
                            : "pending reviews"}
                    </div>

                </div>

            </div>

        </section>


        {disclosures.length === 0 ? (

            <div className="auditor-empty audit-history-empty">

                <strong>
                    No pending reviews
                </strong>

                <p>
                    No disclosures are currently awaiting auditor review.
                </p>

            </div>

        ) : (

            <section className="history-card">

                <div className="history-card-header">

                    <div>

                        <span className="section-eyebrow">
                            REVIEW QUEUE
                        </span>

                        <h2>Disclosures Awaiting Review</h2>

                    </div>

                    <span className="auditor-count">
                        {disclosures.length}{" "}
                        {disclosures.length === 1
                            ? "disclosure"
                            : "disclosures"}
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="data-table auditor-history-table">

                        <thead>

                            <tr>
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

                                        {disclosure.submitted_at
                                            ? new Date(
                                                disclosure.submitted_at
                                            ).toLocaleDateString()
                                            : "—"}

                                    </td>


                                    <td className="history-action-cell">

                                        <Link
                                            className="table-link"
                                            to={`/review-disclosures/${disclosure.id}`}
                                        >
                                            Review Disclosure →
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