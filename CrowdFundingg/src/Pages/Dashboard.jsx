import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Contract/abi.json";
import { Link, useNavigate } from "react-router-dom";

const contractAddress = "0xCf5f44a1769fb65C59d9Aed2ED27202cf3493BbC";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [createdCampaigns, setCreatedCampaigns] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!window.ethereum) {
        alert("MetaMask is required to interact with this dApp!");
        return;
      }
    
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
        const address = await signer.getAddress();
        setUserAddress(address);
    
        // ✅ Fetch campaigns created by the user
        const userCampaigns = await contract.getCampaignsByOwner(address);
        
        // ✅ Fetch all campaigns to check donations
        const allCampaigns = await contract.getAllCampaigns();
    
        let donatedCampaigns = [];
    
        for (let i = 0; i < allCampaigns.length; i++) {
          const campaign = allCampaigns[i];
          const contribution = await contract.getContribution(i, address);
    
          if (contribution > 0) {
            donatedCampaigns.push({
              ...campaign,
              donatedAmount: ethers.formatEther(contribution),
            });
          }
        }
    
        setCreatedCampaigns(userCampaigns);
        setDonatedCampaigns(donatedCampaigns);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 My Dashboard</h2>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`py-2 px-6 rounded-full cursor-pointer border border-blue-600 text-blue-800 font-bold`}
          onClick={() => (navigate('/create-campaign'))}
        >
          Create Campaign
        </button>
        <button
          className={`py-2 px-6 rounded-full cursor-pointer transition ${
            activeTab === "created" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("created")}
        >
          🎯 My Campaigns
        </button>
        <button
          className={`py-2 px-6 rounded-full cursor-pointer transition ${
            activeTab === "donated" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("donated")}
        >
          💰 My Donations
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : activeTab === "created" ? (
        createdCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {campaign.title.length > 25 ? `${campaign.title.slice(0, 25)}...` : campaign.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{campaign.description.slice(0, 80)}...</p>
                  <p className="text-sm text-gray-700 mt-2">🎯 Target: {ethers.formatEther(campaign.target)} ETH</p>
                  <p className="text-sm text-gray-700">💰 Raised: {ethers.formatEther(campaign.amountCollected)} ETH</p>
                  <Link to={`/campaign/${campaign.id}`} className="block mt-3 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
                    View Campaign
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">You haven't created any campaigns yet.</p>
        )
      ) : (
        donatedCampaigns.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Campaign</th>
                <th className="p-3 text-left">Amount Donated</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {donatedCampaigns.map((donation, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="p-3">
                    <Link to={`/campaign/${donation.campaignId}`} className="text-blue-600 hover:underline">
                      {donation.title.length > 25 ? `${donation.title.slice(0, 25)}...` : donation.title}
                    </Link>
                  </td>
                  <td className="p-3">{ethers.formatEther(donation.amount)} ETH</td>
                  <td className="p-3">{new Date(donation.timestamp * 1000).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">You haven't made any donations yet.</p>
        )
      )}
    </div>
  );
};

export default Dashboard;
