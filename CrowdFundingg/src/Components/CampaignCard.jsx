import React from "react";

const CampaignCard = ({ campaignId, title, goal, fundsRaised }) => {
  return (
    <div className="campaign-card">
      <h3>{title}</h3>
      <p>Goal: {goal} ETH</p>
      <p>Raised: {fundsRaised} ETH</p>
      <p>ID: {campaignId}</p>
    </div>
  );
};

export default CampaignCard;
