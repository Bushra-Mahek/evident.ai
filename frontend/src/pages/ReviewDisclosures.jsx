import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getPendingReviews
} from "../api/reviewApi.js";

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

        <div>

            <h1>Pending Disclosure Reviews</h1>

            {disclosures.length === 0 ? (

                <p>No disclosures are currently pending review.</p>

            ) : (

                <table>

                    <thead>

                        <tr>
                            <th>Reporting Year</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {disclosures.map((disclosure) => (

                            <tr key={disclosure.id}>

                                <td>
                                    {disclosure.reporting_year}
                                </td>

                                <td>
                                    {disclosure.status}
                                </td>

                                <td>
                                    {disclosure.submitted_at
                                        ? new Date(
                                            disclosure.submitted_at
                                        ).toLocaleDateString()
                                        : "—"
                                    }
                                </td>

                                <td>

                                    <Link
                                        to={`/review-disclosures/${disclosure.id}`}
                                    >
                                        Review
                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}