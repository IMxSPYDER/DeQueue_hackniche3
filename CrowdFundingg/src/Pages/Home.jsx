import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Contract/abi.json";
import CampaignCard from "../Components/CampaignCard"; // Import the Campaign Card
import { useNavigate } from "react-router-dom";

// Replace with your contract address
const contractAddress = "0x4560869AF45f2F4764F79eF1Fff55e0b3c6E467d";

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!window.ethereum) {
        alert("MetaMask is required to interact with this dApp!");
        return;
      }

      try {
        // Initialize provider and request account access
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        // Initialize contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Fetch all campaigns from the smart contract
        const allCampaigns = await contract.getAllCampaigns();
        console.log("Fetched Campaigns:", allCampaigns);

        // Extract first 4 campaigns for display
        const displayedCampaigns = allCampaigns.slice(0, 4).map((campaign, index) => ({
          id: index, // Add an ID if not present
          title: campaign.title,
          description: campaign.description,
          target: ethers.formatEther(campaign.target),
          amountCollected: ethers.formatEther(campaign.amountCollected),
          deadline: new Date(Number(campaign.deadline) * 1000).toLocaleDateString(),
          image: campaign.image,
          state: campaign.state,
          region: campaign.region,
        }));

        setCampaigns(displayedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="mt-[120px] mx-auto p-6 bg-white shadow-lg rounded-lg max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🚀 Latest Campaigns</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading campaigns...</p>
      ) : campaigns.length > 0 ? (
        <div className="flex flex-row gap-2">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No campaigns available.</p>
      )}

      {/* Button to View More Campaigns */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/campaigns")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
        >
          🔍 View All Campaigns
        </button>
      </div>
    </div>
  );
};

export default HomePage;
