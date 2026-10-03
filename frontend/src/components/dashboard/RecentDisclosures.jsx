import { useState, useEffect } from 'react';

export function RecentDisclosures(props){
    const disclosures = props.disclosures;
    const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
    <section className="dashboard-section recent-disclosures">
      <h2>Recent Disclosures</h2>
      
      {disclosures.length === 0 ? (
        <p className="no-data">No recent disclosures found.</p>
      ) : (
        <div className="table-responsive">
          <table className="disclosures-table">
            <thead>
              <tr>
                {/* Matches your wireframe columns */}
                <th>Company</th>
                <th>Year</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {disclosures.map((disclosure) => (
                <tr key={disclosure.id}>
                  {/* Company Name pulled via the JOIN */}
                  <td className="company-cell">{disclosure.company_name}</td>
                  
                  {/* Reporting Year */}
                  <td>{disclosure.reporting_year}</td>
                  
                  {/* Status label (Draft, Under Review, Verified, Rejected) */}
                  <td>
                    <span className={`status-badge status-${disclosure.status
    .toLowerCase()
    .replaceAll('_', '-')}`}>
                      {disclosure.status}
                    </span>
                  </td>
                  
                  {/* Created At Timestamp formatted neatly */}
                  <td className="date-cell">{formatDate(disclosure.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  

        </>
    )
}