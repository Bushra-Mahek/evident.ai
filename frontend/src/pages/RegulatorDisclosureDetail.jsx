import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import "./Regulator.css";

export function RegulatorDisclosureDetail() {
    const { disclosureId } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDisclosure() {
            try {
                const response = await api.get(
                    `/disclosures/${disclosureId}/review`
                );

                setData(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load disclosure"
                );
            } finally {
                setLoading(false);
            }
        }

        loadDisclosure();
    }, [disclosureId]);

    if (loading) {
        return (
            <div className="page-container">
                Loading disclosure...
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                {error}
            </div>
        );
    }

    const {
        disclosure,
        dataPoints = [],
        documents = [],
        validationResults = [],
        crossVerificationResults = [],
        merkleRoots = [],
        blockchainTransactions = []
    } = data;

    return (
    <div className="regulator-page">

        {/* HEADER */}

        <section className="regulator-header">

            <span className="page-eyebrow">
                REGULATORY OVERSIGHT
            </span>

            <div className="regulator-title-row">

                <div>
                    <h1>
                        {disclosure.reporting_year} Disclosure
                    </h1>

                    <p>
                        Read-only regulatory view of the submitted
                        ESG disclosure and its verification evidence.
                    </p>
                </div>

                <span
                    className={`status-badge status-${disclosure.status.toLowerCase()}`}
                >
                    <span className="status-dot"></span>
                    {disclosure.status}
                </span>

            </div>


            <div className="regulator-detail-meta">

                <div>
                    <span>COMPANY</span>
                    <strong>
                        {disclosure.company_name || "—"}
                    </strong>
                </div>

                <div>
                    <span>REPORTING YEAR</span>
                    <strong>
                        {disclosure.reporting_year}
                    </strong>
                </div>

                <div>
                    <span>ACCESS</span>
                    <strong>Read Only</strong>
                </div>

            </div>

        </section>


        {/* DATA POINTS */}

        <section className="regulator-section">

            <div className="regulator-section-heading">

                <div className="regulator-section-number">
                    01
                </div>

                <div>
                    <span className="section-eyebrow">
                        REPORTED DATA
                    </span>

                    <h2>Data Points</h2>

                    <p>
                        ESG values reported by the company for this
                        disclosure period.
                    </p>
                </div>

                <span className="auditor-count">
                    {dataPoints.length}{" "}
                    {dataPoints.length === 1
                        ? "data point"
                        : "data points"}
                </span>

            </div>


            {dataPoints.length === 0 ? (

                <div className="regulator-empty-inline">
                    No data points available.
                </div>

            ) : (

                <div className="regulator-data-list">

                    {dataPoints.map((point) => (

                        <article
                            className="regulator-data-card"
                            key={point.id}
                        >

                            <div className="regulator-data-heading">

                                <div>
                                    <span>ESG METRIC</span>

                                    <h3>
                                        {point.metric_name ||
                                            point.metric_id}
                                    </h3>
                                </div>

                            </div>


                            <div className="regulator-data-values">

                                <div>
                                    <span>VALUE</span>
                                    <strong>
                                        {point.value}
                                    </strong>
                                </div>

                                <div>
                                    <span>UNIT</span>
                                    <strong>
                                        {point.unit}
                                    </strong>
                                </div>

                                <div>
                                    <span>REPORTING PERIOD</span>
                                    <strong>
                                        {point.period_start}
                                        {" → "}
                                        {point.period_end}
                                    </strong>
                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>


        {/* VERIFICATION GRID */}

        <section className="regulator-verification-grid">

            {/* CROSS SOURCE */}

            <article className="regulator-card">

                <div className="regulator-card-heading">

                    <div className="regulator-card-icon success">
                        ✓
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            SOURCE CHECK
                        </span>

                        <h2>Cross-Source Verification</h2>
                    </div>

                </div>


                {crossVerificationResults.length === 0 ? (

    <div className="regulator-empty-inline">
        No cross-verification results available.
    </div>

) : (

    <div className="regulator-result-list">

        {crossVerificationResults.map((result) => (

            <div
                className="regulator-result-item"
                key={result.id}
            >

                <div>
                    <span>COMPANY VALUE</span>

                    <strong>
                        {result.company_value ?? "—"}
                    </strong>
                </div>

                <div>
                    <span>EXTERNAL VALUE</span>

                    <strong>
                        {result.external_value ?? "—"}
                    </strong>
                </div>

                <div>
                    <span>STATUS</span>

                    <strong>
                        {result.verification_status || "—"}
                    </strong>
                </div>

                {result.external_source && (
                    <div>
                        <span>SOURCE</span>

                        <strong>
                            {result.external_source}
                        </strong>
                    </div>
                )}

            </div>

        ))}

    </div>

)}

            </article>


            {/* VALIDATION */}

            <article className="regulator-card">

                <div className="regulator-card-heading">

                    <div className="regulator-card-icon info">
                        ✓
                    </div>

                    <div>
                        <span className="section-eyebrow">
                            AUTOMATED CHECKS
                        </span>

                        <h2>Automated Validation</h2>
                    </div>

                </div>


                {validationResults.length === 0 ? (

    <div className="regulator-empty-inline">
        No validation results available.
    </div>

) : (

    <div className="regulator-validation-list">

        {validationResults.map((result) => (

            <div
                className="regulator-validation-item"
                key={result.id}
            >

                <div>

                    <strong>
                        {result.rule_code ||
                            result.rule_name ||
                            result.validation_type}
                    </strong>

                    <span>
                        {result.severity || "—"}
                    </span>

                </div>

                <p>
                    {result.message || "No validation message available."}
                </p>

            </div>

        ))}

    </div>

)}

            </article>

        </section>


        {/* BLOCKCHAIN */}

        <section className="regulator-section">

            <div className="regulator-section-heading">

                <div className="regulator-section-number">
                    02
                </div>

                <div>
                    <span className="section-eyebrow">
                        INTEGRITY PROOF
                    </span>

                    <h2>Blockchain Verification</h2>

                    <p>
                        Cryptographic records associated with the
                        submitted disclosure.
                    </p>
                </div>

            </div>


            <div className="regulator-blockchain-grid">

    {merkleRoots.map((root) => (

        <div
            className="regulator-blockchain-card"
            key={root.id}
        >

            <span>MERKLE ROOT</span>

            <code>
                {root.merkle_root || root.root || "—"}
            </code>

            <div className="blockchain-meta">

                <span>NETWORK</span>

                <strong>
                    {root.network || "—"}
                </strong>

            </div>

        </div>

    ))}


    {blockchainTransactions.map((tx) => (

        <div
            className="regulator-blockchain-card"
            key={tx.id}
        >

            <span>TRANSACTION HASH</span>

            <code>
                {tx.transaction_hash || "—"}
            </code>

            <div className="blockchain-meta">

                <span>BLOCK</span>

                <strong>
                    {tx.block_number || "—"}
                </strong>

            </div>

        </div>

    ))}

</div>

        </section>


        {/* EVIDENCE */}

        <section className="regulator-section">

            <div className="regulator-section-heading">

                <div className="regulator-section-number">
                    03
                </div>

                <div>
                    <span className="section-eyebrow">
                        SUPPORTING DOCUMENTATION
                    </span>

                    <h2>Evidence</h2>

                    <p>
                        Supporting documents associated with this
                        disclosure.
                    </p>
                </div>

                <span className="auditor-count">
                    {documents.length}{" "}
                    {documents.length === 1
                        ? "document"
                        : "documents"}
                </span>

            </div>


{documents.length === 0 ? (

    <div className="regulator-empty-inline">
        No supporting documents attached.
    </div>

) : (

    <div className="regulator-evidence-list">

        {documents.map((document) => (

            <div
                className="regulator-evidence-card"
                key={document.id}
            >

                <div className="regulator-evidence-icon">
                    DOC
                </div>

                <div>

                    <strong>
                        {document.file_name}
                    </strong>

                    <span>
                        {document.mime_type || "Document"}
                    </span>

                </div>

                <span className="evidence-available">
                    Available
                </span>

            </div>

        ))}

    </div>

)}

        </section>

    </div>
)};