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

        const userCampaigns = await contract.getCampaignsByOwner(address);
        const allCampaigns = await contract.getAllCampaigns();
        let donatedCampaigns = [];

        for (let i = 0; i < allCampaigns.length; i++) {
          const campaign = allCampaigns[i];
          const contribution = await contract.getContribution(i, address);

          if (contribution > 0) {
            donatedCampaigns.push({
              id: i,
              title: campaign[1],
              description: campaign[2],
              target: campaign[3].toString(),
              deadline: campaign[4].toString(),
              amountCollected: campaign[5].toString(),
              location: `${campaign[6]}, ${campaign[7]}`,
              image: `https://ipfs.io/ipfs/${campaign[8]}`,
              donatedAmount: ethers.formatEther(contribution.toString()),
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

  // **Disconnect Wallet Function**
  const disconnectWallet = () => {
    setUserAddress(null); // Reset user address
    localStorage.removeItem("walletConnected"); // Clear connection data (optional)
    alert("Wallet disconnected!");
  };

  return (
    <div className="mx-auto mt-20 p-6 bg-gray-900 text-gray-300 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">My Dashboard</h2>
        
        {/* **Logout Button (Only visible if wallet is connected)** */}
        {userAddress && (
          <button
            onClick={disconnectWallet}
            className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Logout
          </button>
        )}
      </div>

      <div className="flex justify-center space-x-4 my-6">
        <button
          className="py-2 px-6 rounded-full cursor-pointer border border-purple-400 text-purple-300 font-bold hover:bg-purple-500 hover:text-white transition"
          onClick={() => navigate('/create-campaign')}
        >
          Create Campaign
        </button>
        <button
          className={`py-2 px-6 rounded-full cursor-pointer transition ${
            activeTab === "created" ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => setActiveTab("created")}
        >
          🎯 My Campaigns
        </button>
        <button
          className={`py-2 px-6 rounded-full cursor-pointer transition ${
            activeTab === "donated" ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => setActiveTab("donated")}
        >
          💰 My Donations
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : activeTab === "created" ? (
        createdCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdCampaigns.map((campaign) => {
              let imageUrl = campaign.image || "";
              if (imageUrl.startsWith("Qm") || imageUrl.startsWith("bafy")) {
                imageUrl = `https://ipfs.io/ipfs/${imageUrl}`;
              }

              return (
                <div key={campaign.id} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={campaign.title || "Campaign Image"}
                    className="w-full h-40 object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {campaign.title ? (campaign.title.length > 25 ? `${campaign.title.slice(0, 25)}...` : campaign.title) : "Untitled Campaign"}
                    </h3>
                    <p className="text-gray-400 text-sm">{campaign.description ? campaign.description.slice(0, 80) + "..." : "No description available."}</p>
                    <p className="text-sm text-gray-400 mt-2">🎯 Target: {ethers.formatEther(campaign.target || "0")} ETH</p>
                    <p className="text-sm text-gray-400">💰 Raised: {ethers.formatEther(campaign.amountCollected || "0")} ETH</p>
                    <Link to={`/campaign/${campaign.id}`} className="block mt-3 text-center bg-purple-500 text-white py-2 rounded-md hover:bg-purple-700">
                      View Campaign
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">You haven't created any campaigns yet.</p>
        )
      ) : (
        donatedCampaigns.length > 0 ? (
          <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-3 text-left">Campaign</th>
                <th className="p-3 text-left">Amount Donated</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {donatedCampaigns.map((donation, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">
                    <Link to={`/campaign/${donation.campaignId}`} className="text-blue-400 hover:underline">
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
          <p className="text-center text-gray-500">You haven't made any donations yet.</p>
        )
      )}
    </div>
  );
};

export default Dashboard;
