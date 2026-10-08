import { useState, useEffect } from 'react';

export function SummaryCards(props){
    const data = props.summary;
    return(
        <>
        
    <article className="esg-summary-card">

  <div className="metric-item">
    <span className="metric-label">Total</span>
    <strong className="metric-value">{data.total}</strong>
  </div>

  <div className="metric-item">
    <span className="metric-label">Draft</span>
    <strong className="metric-value">{data.draft}</strong>
  </div>

  <div className="metric-item">
    <span className="metric-label">Under Review</span>
    <strong className="metric-value">{data.underReview}</strong>
  </div>

  <div className="metric-item">
    <span className="metric-label">Verified</span>
    <strong className="metric-value">{data.verified}</strong>
  </div>

  <div className="metric-item">
    <span className="metric-label">Rejected</span>
    <strong className="metric-value">{data.rejected}</strong>
  </div>

</article>
        </>
    )
}