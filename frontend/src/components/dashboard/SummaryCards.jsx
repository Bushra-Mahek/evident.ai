import { useState, useEffect } from 'react';

export function SummaryCards(props){
    const data = props.summary;
    return(
        <>
        
    <article class="esg-summary-card">
  
        
  <div class="metrics-row main-stats">
    
    <div class="metric-item">
      <span class="metric-label">Total</span>
      <strong class="metric-value">{data.total}</strong>
    </div>
    
    <div class="metric-item">
      <span class="metric-label">Draft</span>
      <strong class="metric-value">{data.draft}</strong>
    </div>
    
    <div class="metric-item">
      <span class="metric-label">Under Review</span>
      <strong class="metric-value">{data.underReview}</strong>
    </div>
    
  </div>


  <div class="metrics-row status-stats">
    
    <div class="metric-item">
      <span class="metric-label">Verified</span>
      <strong class="metric-value">{data.verified}</strong>
    </div>
    
    <div class="metric-item">
      <span class="metric-label">Rejected</span>
      <strong class="metric-value">{data.rejected}</strong>
    </div>
    
  </div>
  
</article>
        </>
    )
}