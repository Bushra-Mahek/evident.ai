import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getDisclosureReview,
    verifyDisclosure,
    rejectDisclosure
} from "../api/reviewApi.js";
import "./Auditor.css";

export function DisclosureReview() {

    const { disclosureId } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadReview() {

        try {

            const data =
                await getDisclosureReview(disclosureId);

            setReview(data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load disclosure review"
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadReview();

    }, [disclosureId]);


    async function handleVerify() {

        const confirmed =
            window.confirm(
                "Are you sure you want to verify this disclosure?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await verifyDisclosure(disclosureId);

            alert("Disclosure verified successfully.");

            navigate("/review-disclosures");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to verify disclosure"
            );

        }
    }


    async function handleReject() {

        const notes = window.prompt("Enter rejection reason:");

    if (!notes || !notes.trim()) {
        return;
    }


        try {

            await rejectDisclosure(disclosureId,notes);

            alert("Disclosure rejected successfully.");

            navigate("/review-disclosures");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to reject disclosure"
            );

        }
    }


    if (loading) {
        return <p>Loading disclosure...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    if (!review) {
        return <p>Disclosure not found.</p>;
    }


    const disclosure = review.disclosure;
    const dataPoints = review.dataPoints || [];
    const documents = review.documents || [];
    const validationResults =
        review.validationResults || [];
    const crossVerificationResults =
        review.crossVerificationResults || [];
    const merkleRoots =
        review.merkleRoots || [];
    const blockchainTransactions =
        review.blockchainTransactions || [];


    return (
    <div className="auditor-page">

        {/* HEADER */}

        <section className="review-header">

            <div>

                <span className="page-eyebrow">
                    AUDITOR WORKSPACE
                </span>

                <div className="review-title-row">

                    <div>
                        <h1>
                            {disclosure.reporting_year} Disclosure Review
                        </h1>

                        <p>
                            Review the submitted ESG disclosure,
                            supporting evidence and verification results
                            before making an audit decision.
                        </p>
                    </div>

                    <span className="review-status-badge">
                        <span className="review-status-dot"></span>
                        {disclosure.status}
                    </span>

                </div>

            </div>


            <div className="review-meta">

                <div>
                    <span>REPORTING YEAR</span>
                    <strong>{disclosure.reporting_year}</strong>
                </div>

                <div>
                    <span>COMPANY ID</span>
                    <strong>{disclosure.company_id}</strong>
                </div>

                <div>
                    <span>REVIEW STATUS</span>
                    <strong>Awaiting Decision</strong>
                </div>

            </div>

        </section>


        {/* DATA POINTS */}

        <section className="auditor-section">

            <div className="auditor-section-header">

                <div className="auditor-section-title">

                    <div className="auditor-section-number">
                        01
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            REPORTED DATA
                        </span>

                        <h2>Data Points</h2>

                        <p>
                            Values submitted by the company for this
                            reporting period.
                        </p>
                    </div>

                </div>

                <span className="auditor-count">
                    {dataPoints.length}{" "}
                    {dataPoints.length === 1
                        ? "data point"
                        : "data points"}
                </span>

            </div>


            {dataPoints.length === 0 ? (

                <div className="auditor-empty">
                    No data points submitted.
                </div>

            ) : (

                <div className="review-data-list">

                    {dataPoints.map((dataPoint) => (

                        <article
                            className="review-data-card"
                            key={dataPoint.id}
                        >

                            <div className="review-data-top">

                                <div>
                                    <span>ESG DATA POINT</span>

                                    <h3>
                                        {dataPoint.metric_name ||
                                            "Reported Metric"}
                                    </h3>
                                </div>

                                <span className="verified-chip">
                                    ✓ Submitted
                                </span>

                            </div>


                            <div className="review-data-values">

                                <div>
                                    <span>VALUE</span>
                                    <strong>
                                        {dataPoint.value}
                                    </strong>
                                </div>

                                <div>
                                    <span>UNIT</span>
                                    <strong>
                                        {dataPoint.unit}
                                    </strong>
                                </div>

                                <div>
                                    <span>REPORTING PERIOD</span>
                                    <strong>
                                        {dataPoint.period_start}
                                        {" → "}
                                        {dataPoint.period_end}
                                    </strong>
                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>


        {/* EVIDENCE */}

        <section className="auditor-section">

            <div className="auditor-section-header">

                <div className="auditor-section-title">

                    <div className="auditor-section-number">
                        02
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            SUPPORTING DOCUMENTATION
                        </span>

                        <h2>Evidence</h2>

                        <p>
                            Documents submitted to substantiate the
                            reported ESG data.
                        </p>
                    </div>

                </div>

                <span className="auditor-count">
                    {documents.length}{" "}
                    {documents.length === 1
                        ? "document"
                        : "documents"}
                </span>

            </div>


            {documents.length === 0 ? (

                <div className="auditor-empty">
                    No supporting documents submitted.
                </div>

            ) : (

                <div className="review-documents">

                    {documents.map((document) => (

                        <div
                            className="review-document-card"
                            key={document.id}
                        >

                            <div className="review-document-icon">
                                DOC
                            </div>

                            <div className="review-document-info">

                                <strong>
                                    {document.file_name}
                                </strong>

                                <span>
                                    {document.file_type ||
                                        "Supporting document"}
                                </span>

                            </div>

                            <span className="document-available">
                                Available
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </section>


        {/* VERIFICATION */}

        <section className="auditor-verification-grid">

            {/* CROSS VERIFICATION */}

            <article className="auditor-review-card">

                <div className="auditor-card-heading">

                    <div className="auditor-card-icon success-icon">
                        ✓
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            SOURCE CHECK
                        </span>

                        <h2>Cross-Verification</h2>
                    </div>

                </div>


                {crossVerificationResults.length === 0 ? (

                    <div className="auditor-empty">
                        No cross-verification results available.
                    </div>

                ) : (

                    <div className="review-result-list">

                        {crossVerificationResults.map((result) => (

                            <div
                                className="review-result-card"
                                key={result.id}
                            >

                                <div className="review-result-heading">

                                    <strong>
                                        Company vs External Source
                                    </strong>

                                    <span className="result-verified">
                                        {result.verification_status}
                                    </span>

                                </div>

                                <div className="review-result-values">

                                    <div>
                                        <span>COMPANY VALUE</span>
                                        <strong>
                                            {result.company_value}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>EXTERNAL VALUE</span>
                                        <strong>
                                            {result.external_value}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </article>


            {/* VALIDATION */}

            <article className="auditor-review-card">

                <div className="auditor-card-heading">

                    <div className="auditor-card-icon validation-card-icon">
                        ✓
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            AUTOMATED CHECKS
                        </span>

                        <h2>Validation</h2>
                    </div>

                </div>


                {validationResults.length === 0 ? (

                    <div className="auditor-empty">
                        No validation results available.
                    </div>

                ) : (

                    <div className="review-validation-list">

                        {validationResults.map((result) => (

                            <div
                                className="review-validation-item"
                                key={result.id}
                            >

                                <div>

                                    <strong>
                                        {result.rule_code}
                                    </strong>

                                    <p>
                                        {result.message}
                                    </p>

                                </div>

                                <span
                                    className={`validation-severity validation-severity-${result.severity?.toLowerCase()}`}
                                >
                                    {result.severity}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </article>

        </section>


        {/* BLOCKCHAIN */}

        <section className="auditor-section">

            <div className="auditor-section-header">

                <div className="auditor-section-title">

                    <div className="auditor-section-number">
                        03
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            INTEGRITY PROOF
                        </span>

                        <h2>Blockchain Verification</h2>

                        <p>
                            Cryptographic proof associated with the
                            submitted disclosure.
                        </p>
                    </div>

                </div>

            </div>


            <div className="blockchain-grid">

                {merkleRoots.map((root) => (

                    <div
                        className="blockchain-card"
                        key={root.id}
                    >

                        <span>MERKLE ROOT</span>

                        <code>
                            {root.merkle_root}
                        </code>

                        <div className="blockchain-meta">
                            <span>NETWORK</span>
                            <strong>{root.network}</strong>
                        </div>

                    </div>

                ))}


                {blockchainTransactions.map((tx) => (

                    <div
                        className="blockchain-card"
                        key={tx.id}
                    >

                        <span>TRANSACTION</span>

                        <code>
                            {tx.transaction_hash}
                        </code>

                        <div className="blockchain-meta">

                            <div>
                                <span>BLOCK</span>
                                <strong>{tx.block_number}</strong>
                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>


        {/* AUDITOR DECISION */}

        {disclosure.status === "UNDER_REVIEW" && (

            <section className="auditor-decision-panel">

                <div className="decision-content">

                    <span className="section-eyebrow">
                        FINAL AUDITOR DECISION
                    </span>

                    <h2>
                        Complete the verification review
                    </h2>

                    <p>
                        Verify the disclosure if the submitted data,
                        evidence, automated checks and integrity proof
                        are satisfactory. Reject it if corrections
                        are required.
                    </p>

                </div>


                <div className="decision-actions">

                    <button
                        className="auditor-reject-button"
                        onClick={handleReject}
                    >
                        Reject Disclosure
                    </button>

                    <button
                        className="auditor-verify-button"
                        onClick={handleVerify}
                    >
                        Verify Disclosure
                        <span>→</span>
                    </button>

                </div>

            </section>

        )}

    </div>
)};