import { useState, useEffect } from 'react';
import { getDashboard } from '../api/dashboardApi.js';
import { SummaryCards } from '../components/dashboard/SummaryCards.jsx';
import { RecentDisclosures } from '../components/dashboard/RecentDisclosures.jsx';
import { CertificatesList } from '../components/dashboard/CertificatesList.jsx';
import { getUser } from '../utils/auth.js';


export function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const user = getUser();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                const data = await getDashboard();
                setDashboardData(data.dashboard);

            } catch (err) {
                console.error(
                    "Failed to fetch dashboard data:",
                    err
                );

                setError(err.message);

            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="page-state">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-state page-state-error">
                <h2>Unable to load dashboard</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="page-state">
                <p>No dashboard data found.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="dashboard-hero">

                <div className="dashboard-hero-content">

                    <div className="dashboard-eyebrow">
                        ESG REPORTING PLATFORM
                    </div>

                    <h1>
                        Welcome back,{" "}
                        <span>{user?.full_name}</span>
                    </h1>

                    <p>
                        Here's an overview of your ESG reporting
                        and verification activity.
                    </p>

                </div>

                <div className="dashboard-hero-badge">
                    <span className="hero-status-dot"></span>

                    <div>
                        <strong>Account</strong>
                        <small>{user?.role}</small>
                    </div>
                </div>

            </section>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="dashboard-summary">

                <div className="section-heading">
                    <div>
                        <h2>Reporting Overview</h2>
                        <p>
                            Current status of your ESG disclosures
                        </p>
                    </div>
                </div>

                <SummaryCards
                    summary={dashboardData.summary}
                />

            </section>


            {/* =================================================
                RECENT DISCLOSURES
            ================================================= */}

            <RecentDisclosures
                disclosures={
                    dashboardData.recentDisclosures
                }
            />


            {/* =================================================
                CERTIFICATES
            ================================================= */}

            <CertificatesList
                certificates={dashboardData.certificates}
            />

        </div>
    );
}