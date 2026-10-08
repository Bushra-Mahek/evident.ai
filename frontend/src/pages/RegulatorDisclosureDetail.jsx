import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Disclosure Review</h1>
                    <p>
                        Read-only regulatory view of the ESG disclosure.
                    </p>
                </div>
            </div>

            <div className="card">
                <h2>Disclosure Information</h2>

                <p>
                    <strong>Reporting Year:</strong>{" "}
                    {disclosure.reporting_year}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {disclosure.status}
                </p>

                <p>
                    <strong>Company:</strong>{" "}
                    {disclosure.company_name || "—"}
                </p>
            </div>

            <div className="card">
                <h2>Data Points</h2>

                {dataPoints.length === 0 ? (
                    <p>No data points.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                                <th>Unit</th>
                                <th>Period</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataPoints.map((point) => (
                                <tr key={point.id}>
                                    <td>
                                        {point.metric_name ||
                                            point.metric_id}
                                    </td>
                                    <td>{point.value}</td>
                                    <td>{point.unit}</td>
                                    <td>
                                        {point.period_start} →{" "}
                                        {point.period_end}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <h2>Cross-Source Verification</h2>

                {crossVerificationResults.map((result) => (
                    <p key={result.id}>
                        <strong>{result.verification_status}</strong>
                        {result.external_source &&
                            ` — ${result.external_source}`}
                    </p>
                ))}
            </div>

            <div className="card">
                <h2>Automated Validation</h2>

                {validationResults.map((result) => (
                    <p key={result.id}>
                        <strong>{result.validation_status}</strong>
                        {" — "}
                        {result.rule_name || result.validation_type}
                    </p>
                ))}
            </div>

            <div className="card">
                <h2>Blockchain Verification</h2>

                {merkleRoots.map((root) => (
                    <p key={root.id}>
                        <strong>Merkle Root:</strong>{" "}
                        {root.merkle_root || root.root}
                    </p>
                ))}

                {blockchainTransactions.map((tx) => (
                    <p key={tx.id}>
                        <strong>Transaction:</strong>{" "}
                        {tx.transaction_hash}
                    </p>
                ))}
            </div>

            <div className="card">
                <h2>Evidence</h2>
                <p>{documents.length} document(s) attached.</p>
            </div>
        </div>
    );
}
