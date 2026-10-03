import { useState, useEffect } from 'react';
import { getDashboard } from '../api/dashboardApi.js';
import { SummaryCards } from '../components/dashboard/SummaryCards.jsx';
import { RecentDisclosures } from '../components/dashboard/RecentDisclosures.jsx';
import { CertificatesList } from '../components/dashboard/CertificatesList.jsx';
import { logout,getUser } from '../utils/auth.js';
import { Link } from 'react-router-dom';

export function Dashboard(){
    const [dashboardData,setDashboardData] = useState(null);
    const [error,setError] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const user = getUser();

     useEffect(()=>{
        const fetchDashboardData = async ()=>{
        try{
            setIsLoading(true);

            const data = await getDashboard();
            setDashboardData(data.dashboard);
        }

        catch(err){
            console.error("Failed to fetch dashboard data:", err);
            setError(err.message);
        }

        finally {
            setIsLoading(false);
        }

    };
    fetchDashboardData()},[]);

    if(isLoading){
        return (
            <div>
                Loading DashBoard data....
            </div>
        )
    }

  
    if (error) {
    return (
        <div>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
        </div>
    );

    }

    console.log(dashboardData);
    return(
        <>
        <h1>Welcome, {user?.full_name}</h1>
<p>Role: {user?.role}</p>
        {
           
            dashboardData? (
                <>
                <SummaryCards summary={dashboardData.summary} />
                <RecentDisclosures disclosures={dashboardData.recentDisclosures}/>
                <CertificatesList certificates={dashboardData.certificates}/>
                </>
            ): (
                <p>No data found.</p>
            )
        }
        <button onClick={logout}>
            Logout
        </button>
        </>
    );
}

