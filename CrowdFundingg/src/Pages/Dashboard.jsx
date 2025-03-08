import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import crowdfundingABI from "../Contract/abi.json";

const contractAddress = "0xCf5f44a1769fb65C59d9Aed2ED27202cf3493BbC";

const Dashboard = ({ account, setAccount }) => {
  const [createdCampaigns, setCreatedCampaigns] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    imageUrl: "",
  });

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!account) return;

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const signer = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, crowdfundingABI, acco);
      setContract(contractInstance);

      // Get all campaigns
      const campaignCount = await contractInstance.campaignCount();
      let userCreated = [];
      let userDonated = [];

      for (let i = 0; i < campaignCount; i++) {
        const campaign = await contractInstance.campaigns(i);

        if (campaign.creator.toLowerCase() === account.toLowerCase()) {
          userCreated.push({ id: i, ...campaign });
        }

        const userDonation = await contractInstance.donations(account, i);
        if (userDonation.gt(0)) {
          userDonated.push({ id: i, ...campaign, amountDonated: userDonation });
        }
      }

      setCreatedCampaigns(userCreated);
      setDonatedCampaigns(userDonated);
    };

    if (window.ethereum) {
      loadBlockchainData();
    }
  }, [account]);

  // Handle input change

  // Disconnect Wallet
  const handleLogout = () => {
    setAccount(null);
  };

  return (
    <div className="max-w-6xl mt-[100px] mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* Create Campaign Button */}
      <div className="my-6 flex justify-center">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
        >
          ➕ Create a New Campaign
        </button>
      </div>

      {/* Created Campaigns */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📌 My Created Campaigns</h2>
        {createdCampaigns.length === 0 ? (
          <p className="text-gray-500">You haven't created any campaigns yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdCampaigns.map((campaign, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-lg">
                <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="text-lg font-bold">{campaign.title}</h3>
                <p className="text-gray-700">{campaign.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-600">Goal: {ethers.utils.formatEther(campaign.goal)} ETH</p>
                <p className="text-sm text-gray-600">Raised: {ethers.utils.formatEther(campaign.fundsRaised)} ETH</p>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default Dashboard;
