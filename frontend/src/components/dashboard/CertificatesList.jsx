import React from 'react';

// Pass down the certificates array from the parent dashboard via props
export function CertificatesList(props) {
  const certificates = props.certificates;
  // Format the generation timestamps cleanly (e.g., "Oct 1, 2026")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper to slice long blockchain/system hashes for cleaner display
  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <section className="dashboard-section recent-certificates">
      <h2>Recent Certificates</h2>
      
      {certificates.length === 0 ? (
        <p className="no-data">No recent certificates generated.</p>
      ) : (
        <div className="table-responsive">
          <table className="certificates-table">
            <thead>
              <tr>
                <th>Certificate No.</th>
                <th>Hash Reference</th>
                <th>Generated At</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  {/* Certificate Number Column */}
                  <td className="cert-number-cell">{cert.certificate_number}</td>
                  
                  {/* System/Blockchain Integrity Hash Reference */}
                  <td className="hash-cell" title={cert.certificate_hash}>
                    <code>{truncateHash(cert.certificate_hash)}</code>
                  </td>
                  
                  {/* Generation Date Timestamp */}
                  <td className="date-cell">{formatDate(cert.generated_at)}</td>
                  
                  {/* Action Link to the PDF storage URL */}
                  <td className="action-cell text-right">
                    <a 
                      href={cert.certificate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-view-link"
                    >
                      View Document →
                    </a>
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
