import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../Contract/abi.json'
// Replace with your contract ABI and address
const contractAddress = '0xd03907c2F32c99ad695e4FC3CD469C93871E3371';

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is required to interact with this dApp!");
        return;
      }

      try {
        // Initialize provider using window.ethereum
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request account access if not already granted
        await provider.send("eth_requestAccounts", []);

        // Initialize contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Fetch campaigns (limit to first 4)
        const allCampaigns = await contract.getCampaigns();
        const maxCampaigns = allCampaigns.slice(0, 4);

        // Set the campaigns to state
        setCampaigns(maxCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div>
      <h1>Latest Campaigns</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="campaign-list">
          {campaigns.length > 0 ? (
            campaigns.map((campaign, index) => (
              <div key={index} className="campaign-card">
                <img src={campaign.image} alt={campaign.title} />
                <h2>{campaign.title}</h2>
                <p>{campaign.description}</p>
                <p>Target: {ethers.utils.formatEther(campaign.target)} ETH</p>
                <p>Amount Collected: {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
                <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleDateString()}</p>
                <p>State: {campaign.state}</p>
                <p>Region: {campaign.region}</p>
              </div>
            ))
          ) : (
            <p>No campaigns available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
