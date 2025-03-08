import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import contractABI from "../Contract/abi.json";

const contractAddress = "0x84c35E54f54BBb44c3Fb40d6E4d477B3E580F8a7";

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
        const formattedCampaigns = campaignsData.map((campaign, index) => {
          let imageUrl = campaign.image || "";

          // Check if image is an IPFS hash and convert to URL
          if (imageUrl.startsWith("Qm") || imageUrl.startsWith("bafy")) {
            imageUrl = `https://ipfs.io/ipfs/${imageUrl}`;
          }

          return {
            id: index,
            title: campaign.title || "Untitled Campaign",
            description: campaign.description || "No description available.",
            target: ethers.formatEther(campaign.target),
            amountCollected: ethers.formatEther(campaign.amountCollected),
            deadline: campaign.deadline > 0 ? new Date(Number(campaign.deadline) * 1000).toLocaleDateString() : "N/A",
            image: imageUrl || "https://via.placeholder.com/300",
            state: campaign.state || "Unknown",
            region: campaign.region || "Unknown",
          };
        });

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
    <div className="mx-auto mt-[25px] p-6 bg-black text-gray-300">
      <h1 className="text-4xl font-bold text-white mb-6">All Campaigns</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading campaigns...</p>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="relative cursor-pointer bg-gray-900 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {/* Campaign Image with Error Handling */}
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-44 object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }} // Fallback image
              />

              {/* Campaign Details */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-white truncate">
                  {campaign.title.length > 25 ? `${campaign.title.slice(0, 25)}...` : campaign.title}
                </h2>

                <p className="text-sm text-gray-400 mb-3">
                  {campaign.description.length > 80 ? `${campaign.description.slice(0, 80)}...` : campaign.description}
                </p>

                {/* Progress Bar */}
                <div className="relative w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-500"
                    style={{
                      width: `${(campaign.amountCollected / campaign.target) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Campaign Stats */}
                <div className="mt-3 text-sm text-gray-400">
                  <p><strong>🎯 Target:</strong> {campaign.target} ETH</p>
                  <p><strong>💰 Raised:</strong> {campaign.amountCollected} ETH</p>
                  <p><strong>⏳ Deadline:</strong> {campaign.deadline}</p>
                  <p><strong>📍 Location:</strong> {campaign.state}, {campaign.region}</p>
                </div>

                {/* View Details Button */}
                <Link
                  to={`/campaign/${campaign.id}`}
                  className="block mt-4 text-center bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md hover:opacity-90 transition"
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
