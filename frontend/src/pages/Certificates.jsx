import React, { useEffect, useState } from "react";
import {
    getCertificates,
    getCertificate
} from "../api/certificateApi.js";

export function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCertificates();
    }, []);

    async function loadCertificates() {
        try {
            const response = await getCertificates();
            setCertificates(response.certificates || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load certificates.");
        } finally {
            setLoading(false);
        }
    }

    async function handleViewCertificate(certificateId) {
        try {
            const result = await getCertificate(certificateId);

            window.open(
                result.certificate.downloadUrl,
                "_blank"
            );
        } catch (err) {
            console.error(err);
            alert("Unable to open certificate.");
        }
    }

    if (loading) {
        return (
            <div className="page-state">
                <div className="loading-spinner"></div>
                <p>Loading certificates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-state error-state">
                <div className="state-icon">!</div>
                <h2>Unable to load certificates</h2>
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
                        VERIFICATION RECORDS
                    </span>

                    <h1>Certificates</h1>

                    <p>
                        Official verification certificates issued for
                        your organization's ESG disclosures.
                    </p>
                </div>

                <div className="certificate-header-badge">
                    <span className="certificate-dot"></span>
                    Verified Records
                </div>
            </div>


            {/* CERTIFICATE SUMMARY */}
            <div className="certificate-summary">

                <div className="certificate-summary-icon">
                    ✓
                </div>

                <div>
                    <span className="summary-label">
                        VERIFIED DISCLOSURES
                    </span>

                    <strong>
                        {certificates.length}
                    </strong>
                </div>

            </div>


            {certificates.length === 0 ? (

                <section className="content-card">

                    <div className="empty-state certificate-empty">

                        <div className="certificate-empty-icon">
                            ◈
                        </div>

                        <h2>No certificates yet</h2>

                        <p>
                            Certificates will appear here once your
                            disclosures have successfully completed
                            auditor verification.
                        </p>

                    </div>

                </section>

            ) : (

                <div className="certificate-grid">

                    {certificates.map((certificate) => (

                        <article
                            key={certificate.id}
                            className="certificate-card"
                        >

                            <div className="certificate-card-top">

                                <div className="certificate-symbol">
                                    ✓
                                </div>

                                <span className="certificate-status">
                                    VERIFIED
                                </span>

                            </div>


                            <div className="certificate-card-body">

                                <span className="certificate-label">
                                    VERIFICATION CERTIFICATE
                                </span>

                                <h2>
                                    {certificate.certificate_number}
                                </h2>

                                <div className="certificate-details">

                                    <div>
                                        <span>
                                            Reporting Year
                                        </span>

                                        <strong>
                                            {certificate.reporting_year}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Issued
                                        </span>

                                        <strong>
                                            {new Date(
                                                certificate.generated_at
                                            ).toLocaleDateString(
                                                undefined,
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="certificate-card-footer">

                                <span className="certificate-note">
                                    Ethereum-backed verification
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-primary btn-small"
                                    onClick={() =>
                                        handleViewCertificate(
                                            certificate.id
                                        )
                                    }
                                >
                                    View Certificate
                                    <span>→</span>
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </div>
    );
}