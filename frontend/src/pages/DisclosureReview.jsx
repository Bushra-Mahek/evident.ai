import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getDisclosureReview,
    verifyDisclosure,
    rejectDisclosure
} from "../api/reviewApi.js";

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

        <div>

            <h1>Disclosure Review</h1>

            <hr />

            <h2>Disclosure Details</h2>

            <p>
                <strong>Reporting Year:</strong>{" "}
                {disclosure.reporting_year}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {disclosure.status}
            </p>

            <p>
                <strong>Company ID:</strong>{" "}
                {disclosure.company_id}
            </p>


            <hr />

            <h2>Data Points</h2>

            {dataPoints.length === 0 ? (

                <p>No data points.</p>

            ) : (

                dataPoints.map((dataPoint) => (

                    <div key={dataPoint.id}>

                        <p>
                            <strong>Value:</strong>{" "}
                            {dataPoint.value}
                        </p>

                        <p>
                            <strong>Unit:</strong>{" "}
                            {dataPoint.unit}
                        </p>

                        <p>
                            <strong>Period:</strong>{" "}
                            {dataPoint.period_start}
                            {" → "}
                            {dataPoint.period_end}
                        </p>

                        <hr />

                    </div>

                ))

            )}


            <h2>Evidence</h2>

            {documents.length === 0 ? (

                <p>No supporting documents.</p>

            ) : (

                documents.map((document) => (

                    <div key={document.id}>

                        <p>
                            <strong>File:</strong>{" "}
                            {document.file_name}
                        </p>

                    </div>

                ))

            )}


            <h2>Cross-Verification</h2>

            {crossVerificationResults.length === 0 ? (

                <p>No cross-verification results.</p>

            ) : (

                crossVerificationResults.map((result) => (

                    <div key={result.id}>

                        <p>
                            <strong>Company Value:</strong>{" "}
                            {result.company_value}
                        </p>

                        <p>
                            <strong>External Value:</strong>{" "}
                            {result.external_value}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {result.verification_status}
                        </p>

                    </div>

                ))

            )}


            <h2>Validation</h2>

            {validationResults.length === 0 ? (

                <p>No validation results.</p>

            ) : (

                validationResults.map((result) => (

                    <div key={result.id}>

                        <strong>
                            {result.rule_code}
                        </strong>

                        {" — "}

                        {result.severity}

                        <p>
                            {result.message}
                        </p>

                    </div>

                ))

            )}


            <h2>Blockchain Verification</h2>

            {merkleRoots.map((root) => (

                <div key={root.id}>

                    <p>
                        <strong>Merkle Root:</strong>{" "}
                        {root.merkle_root}
                    </p>

                    <p>
                        <strong>Network:</strong>{" "}
                        {root.network}
                    </p>

                </div>

            ))}


            {blockchainTransactions.map((tx) => (

                <div key={tx.id}>

                    <p>
                        <strong>Transaction:</strong>{" "}
                        {tx.transaction_hash}
                    </p>

                    <p>
                        <strong>Block:</strong>{" "}
                        {tx.block_number}
                    </p>

                </div>

            ))}


            {disclosure.status === "UNDER_REVIEW" && (

                <div>

                    <hr />

                    <button onClick={handleVerify}>
                        VERIFY DISCLOSURE
                    </button>

                    <button onClick={handleReject}>
                        REJECT DISCLOSURE
                    </button>

                </div>

            )}

        </div>
    );
}