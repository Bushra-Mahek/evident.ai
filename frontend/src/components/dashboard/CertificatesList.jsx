import React from "react";
import { getCertificate } from "../../api/certificateApi.js";

export function CertificatesList(props) {
    const certificates = props.certificates;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const truncateHash = (hash) => {
        if (!hash) return "";
        return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
    };

    const handleViewCertificate = async (certificateId) => {
        try {
            const response = await getCertificate(certificateId);

            window.open(
                response.certificate.downloadUrl,
                "_blank"
            );
        } catch (error) {
            console.error(
                "Failed to open certificate:",
                error
            );

            alert("Unable to open certificate.");
        }
    };

    return (
        <section className="dashboard-section recent-certificates">
            <h2>Recent Certificates</h2>

            {certificates.length === 0 ? (
                <p className="no-data">
                    No recent certificates generated.
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="certificates-table">
                        <thead>
                            <tr>
                                <th>Certificate No.</th>
                                <th>Hash Reference</th>
                                <th>Generated At</th>
                                <th className="text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {certificates.map((cert) => (
                                <tr key={cert.id}>
                                    <td className="cert-number-cell">
                                        {cert.certificate_number}
                                    </td>

                                    <td
                                        className="hash-cell"
                                        title={cert.certificate_hash}
                                    >
                                        <code>
                                            {truncateHash(
                                                cert.certificate_hash
                                            )}
                                        </code>
                                    </td>

                                    <td className="date-cell">
                                        {formatDate(
                                            cert.generated_at
                                        )}
                                    </td>

                                    <td className="action-cell text-right">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewCertificate(
                                                    cert.id
                                                )
                                            }
                                            className="btn-view-link"
                                        >
                                            View Document →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}