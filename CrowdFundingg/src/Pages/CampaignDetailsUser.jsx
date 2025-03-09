import React from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../Contract/abi.json";

const contractAddress = "0x84c35E54f54BBb44c3Fb40d6E4d477B3E580F8a7";

const CampaignDetailsUser = () => {
  const location = useLocation();
  const campaign = location.state?.campaign;

  if (!campaign) {
    return <p className="text-center text-gray-500">Campaign not found.</p>;
  }

  const withdrawFunds = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.withdrawFunds(campaign.id);
      await tx.wait();
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert("Error withdrawing funds.");
    }
  };

  return (
    <div className="bg-black mt-[85px] pt-[10px] pb-[20px]">
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-gray-300 shadow-lg rounded-lg mt-10">
      <img src={campaign.image} alt={campaign.title} className="w-full h-60 object-cover rounded" />
      <h2 className="text-3xl font-bold text-white mt-4">{campaign.title}</h2>
      <p className="text-gray-400 mt-2">{campaign.description}</p>
      <p className="mt-4 text-lg">🎯 Target: {ethers.formatEther(campaign.target)} ETH</p>
      <p className="mt-2 text-lg">💰 Raised: {ethers.formatEther(campaign.amountCollected)} ETH</p>

      {ethers.parseEther(campaign.amountCollected) >= ethers.parseEther(campaign.target) ? (
        <button
          onClick={withdrawFunds}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-6 cursor-pointer rounded transition">
          Withdraw Funds
        </button>
      ) : (
        <p className="mt-4 text-red-500">Target not reached. Withdrawal unavailable.</p>
      )}
    </div>
    </div>
  );
};

export default CampaignDetailsUser;
