import React, { useEffect, useState } from "react";
import { getCertificates } from "../api/certificateApi.js";

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

    if (loading) {
        return <div>Loading certificates...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Certificates</h1>

            {certificates.length === 0 ? (
                <p>No certificates available yet.</p>
            ) : (
                <div>
                    {certificates.map((certificate) => (
                        <div key={certificate.id}>
                            <h3>{certificate.certificate_number}</h3>

                            <p>
                                Reporting Year:{" "}
                                {certificate.reporting_year}
                            </p>

                            <p>
                                Issued At:{" "}
                                {new Date(
    certificate.generated_at
).toLocaleDateString()}
                            </p>

                            <button
                                onClick={async () => {
                                    const response =
                                        await import(
                                            "../api/certificateApi.js"
                                        );

                                    const result =
                                        await response.getCertificate(
                                            certificate.id
                                        );

                                    window.open(
                                        result.certificate.downloadUrl,
                                        "_blank"
                                    );
                                }}
                            >
                                View / Download
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
