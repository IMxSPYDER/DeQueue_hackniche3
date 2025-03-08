import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import contractABI from "../Contract/abi.json";

const contractAddress = "0xCf5f44a1769fb65C59d9Aed2ED27202cf3493BbC";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!window.ethereum) {
        alert("MetaMask is required to interact with this dApp!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        // Fetch all campaigns from the smart contract
        const campaignsData = await contract.getAllCampaigns(); 
        console.log("Raw Campaign Data:", campaignsData);

        // Format the fetched campaign data
        const formattedCampaigns = campaignsData.map((campaign, index) => ({
          id: index,
          title: campaign.title || "Untitled Campaign",
          description: campaign.description || "No description available.",
          target: ethers.formatEther(campaign.target),
          amountCollected: ethers.formatEther(campaign.amountCollected),
          deadline: campaign.deadline > 0 ? new Date(Number(campaign.deadline) * 1000).toLocaleDateString() : "N/A",
          image: campaign.image || "https://via.placeholder.com/300",
          state: campaign.state || "Unknown",
          region: campaign.region || "Unknown",
        }));

        setCampaigns(formattedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-7xl mt-[100px] mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📢 All Campaigns</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading campaigns...</p>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {campaigns.map((campaign) => (
    <div
      key={campaign.id}
      className="relative bg-white shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
    >
      {/* Campaign Image */}
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-44 object-cover"
      />

      {/* Campaign Details */}
      <div className="p-5">
        {/* Campaign Title (Limited to 25 Characters) */}
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {campaign.title.length > 25 ? `${campaign.title.slice(0, 25)}...` : campaign.title}
        </h2>

        {/* Campaign Description (Limited to 80 Characters) */}
        <p className="text-sm text-gray-600 mb-3">
          {campaign.description.length > 80 ? `${campaign.description.slice(0, 80)}...` : campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500"
            style={{
              width: `${(campaign.amountCollected / campaign.target) * 100}%`,
            }}
          ></div>
        </div>

        {/* Campaign Stats */}
        <div className="mt-3 text-sm text-gray-700">
          <p><strong>🎯 Target:</strong> {campaign.target} ETH</p>
          <p><strong>💰 Raised:</strong> {campaign.amountCollected} ETH</p>
          <p><strong>⏳ Deadline:</strong> {campaign.deadline}</p>
          <p><strong>📍 Location:</strong> {campaign.state}, {campaign.region}</p>
        </div>

        {/* View Details Button */}
        <Link
          to={`/campaign/${campaign.id}`}
          className="block mt-4 text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-md hover:opacity-90 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  ))}


          
        </div>
      ) : (
        <p className="text-center text-gray-500">No campaigns available.</p>
      )}
    </div>
  );
};

export default CampaignList;
