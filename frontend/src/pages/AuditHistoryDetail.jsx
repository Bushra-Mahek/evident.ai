import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDisclosureTimeline } from "../api/reviewApi.js";
import "./Auditor.css";

export function AuditHistoryDetail() {
    const { disclosureId } = useParams();

    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTimeline();
    }, [disclosureId]);

    async function loadTimeline() {
        try {
            setLoading(true);

            const data = await getDisclosureTimeline(disclosureId);

            setTimeline(data.timeline || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load audit history"
            );
        } finally {
            setLoading(false);
        }
    }

    function formatDate(date) {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    }

    if (loading) {
        return <p>Loading audit timeline...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
    <div className="auditor-page">

        <section className="review-header">

            <span className="page-eyebrow">
                AUDITOR WORKSPACE
            </span>

            <div className="review-title-row">

                <div>
                    <h1>Disclosure Audit Timeline</h1>

                    <p>
                        A chronological record of actions and status
                        changes associated with this disclosure.
                    </p>
                </div>

                <Link
                    className="audit-back-link"
                    to="/audit-history"
                >
                    ← Audit History
                </Link>

            </div>

        </section>


        {timeline.length === 0 ? (

            <div className="auditor-empty audit-history-empty">
                No audit history available.
            </div>

        ) : (

            <section className="timeline-card">

                <div className="history-card-header">

                    <div>
                        <span className="section-eyebrow">
                            AUDIT TRAIL
                        </span>

                        <h2>Activity Timeline</h2>
                    </div>

                    <span className="auditor-count">
                        {timeline.length} events
                    </span>

                </div>


                <div className="timeline-list">

                    {timeline.map((event) => (

                        <article
                            className="timeline-event"
                            key={event.id}
                        >

                            <div className="timeline-marker">
                                <span></span>
                            </div>

                            <div className="timeline-event-content">

                                <div className="timeline-event-top">

                                    <div>
                                        <span className="section-eyebrow">
                                            {event.action}
                                        </span>

                                        <h3>
                                            {event.old_status || "Initial"}
                                            {" → "}
                                            {event.new_status || "-"}
                                        </h3>
                                    </div>

                                    <time>
                                        {formatDate(
                                            event.created_at
                                        )}
                                    </time>

                                </div>


                                <div className="timeline-event-meta">

                                    <span>
                                        Actor
                                        <strong>
                                            {event.actor_name || "-"}
                                        </strong>
                                    </span>

                                    <span>
                                        Role
                                        <strong>
                                            {event.actor_role || "-"}
                                        </strong>
                                    </span>

                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            </section>

        )}

    </div>
)};