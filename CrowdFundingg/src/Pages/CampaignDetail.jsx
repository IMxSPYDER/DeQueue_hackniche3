import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import contractABI from '../Contract/abi.json';

const contractAddress = '0x4560869AF45f2F4764F79eF1Fff55e0b3c6E467d';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!window.ethereum) {
        alert("MetaMask is required to interact with this dApp!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const campaignData = await contract.campaigns(id);

        const formattedCampaign = {
          title: campaignData.title,
          description: campaignData.description,
          target: ethers.formatEther(campaignData.target),
          amountCollected: ethers.formatEther(campaignData.amountCollected),
          deadline: new Date(Number(campaignData.deadline) * 1000).toLocaleDateString(),
          image: campaignData.image,
          state: campaignData.state,
          region: campaignData.region
        };

        setCampaign(formattedCampaign);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  return (
    <div className="max-w-4xl mt-[120px] mx-auto p-6 bg-white shadow-lg rounded-lg">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : campaign ? (
        <div 
  key={campaign.id} 
  onClick={() => navigate(`/campaign/${campaign.id}`)} 
  className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
>
  <img 
    src={campaign.image} 
    alt={campaign.title} 
    className="w-full h-52 object-cover"
  />
  <div className="p-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">{campaign.title}</h2>
    <p className="text-gray-600 text-sm mb-4">{campaign.description.substring(0, 100)}...</p>
    <div className="border-t pt-2">
      <p className="text-gray-700 text-sm flex items-center">🎯 <span className="ml-1">Target: {campaign.target} ETH</span></p>
      <p className="text-gray-700 text-sm flex items-center">💰 <span className="ml-1">Raised: {campaign.amountCollected} ETH</span></p>
      <p className="text-gray-700 text-sm flex items-center">⏳ <span className="ml-1">Deadline: {campaign.deadline}</span></p>
      <p className="text-gray-700 text-sm flex items-center">📍 <span className="ml-1">{campaign.state}, {campaign.region}</span></p>
    </div>
  </div>
</div>
      ) : (
        <p className="text-center text-gray-500">Campaign not found.</p>
      )}
    </div>
  );
};

export default CampaignDetail;
