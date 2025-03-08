import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Contract/abi.json";
import { Link, useNavigate } from "react-router-dom";

const contractAddress = "0x84c35E54f54BBb44c3Fb40d6E4d477B3E580F8a7";

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
      id: i, // Ensure each campaign has a unique ID
      title: campaign[1], // Fix title retrieval
      description: campaign[2], // Fix description retrieval
      target: campaign[3].toString(), // Convert BigInt to string
      deadline: campaign[4].toString(),
      amountCollected: campaign[5].toString(),
      location: `${campaign[6]}, ${campaign[7]}`, // Fix location extraction
      image: `https://ipfs.io/ipfs/${campaign[8]}`, // Ensure IPFS URL is correct
      donatedAmount: ethers.formatEther(contribution.toString()), // Convert to ETH
    });
  }
}
        setCreatedCampaigns(userCampaigns);
        setDonatedCampaigns(donatedCampaigns);
        console.log(donatedCampaigns)
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
          onClick={() => navigate('/create-campaign')}
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
            {createdCampaigns.map((campaign) => {
              // ✅ Fix IPFS Image Handling
              let imageUrl = campaign.image || "";
              if (imageUrl.startsWith("Qm") || imageUrl.startsWith("bafy")) {
                imageUrl = `https://ipfs.io/ipfs/${imageUrl}`;
              }

              return (
                <div key={campaign.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={campaign.title || "Campaign Image"}
                    className="w-full h-40 object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300")} // ✅ Fallback Image
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {campaign.title ? (campaign.title.length > 25 ? `${campaign.title.slice(0, 25)}...` : campaign.title) : "Untitled Campaign"}
                    </h3>
                    <p className="text-gray-600 text-sm">{campaign.description ? campaign.description.slice(0, 80) + "..." : "No description available."}</p>
                    <p className="text-sm text-gray-700 mt-2">🎯 Target: {ethers.formatEther(campaign.target || "0")} ETH</p>
                    <p className="text-sm text-gray-700">💰 Raised: {ethers.formatEther(campaign.amountCollected || "0")} ETH</p>
                    <Link to={`/campaign/${campaign.id}`} className="block mt-3 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
                      View Campaign
                    </Link>
                  </div>
                </div>
              );
            })}
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
                      {donation.title ? (donation.title.length > 25 ? `${donation.title.slice(0, 25)}...` : donation.title) : "Untitled"}
                    </Link>
                  </td>
                  <td className="p-3">{donation.donatedAmount || "0"} ETH</td>
                  <td className="p-3">{donation.deadline ? new Date(donation.deadline * 1000).toLocaleDateString() : "N/A"}</td>
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
