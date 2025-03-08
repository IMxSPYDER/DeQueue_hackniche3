import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import contractABI from "../Contract/abi.json";

const contractAddress = "0x4560869AF45f2F4764F79eF1Fff55e0b3c6E467d";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donors, setDonors] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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
        const donorData = await contract.getDonors(id); // Fetch donors from contract

        const formattedCampaign = {
          id,
          title: campaignData.title,
          description: campaignData.description,
          target: ethers.formatEther(campaignData.target),
          amountCollected: ethers.formatEther(campaignData.amountCollected),
          deadline: new Date(Number(campaignData.deadline) * 1000).toLocaleDateString(),
          image: campaignData.image,
          state: campaignData.state,
          region: campaignData.region,
        };

        setCampaign(formattedCampaign);
        setDonors(donorData);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      setProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.donateToCampaign(id, {
        value: ethers.parseEther(donationAmount),
      });

      await tx.wait();
      alert("Donation Successful! 🎉");

      // Refresh page to show updated donations
      window.location.reload();
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Transaction failed! ❌");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mt-[120px] mx-auto p-6 bg-white shadow-xl rounded-lg">
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : campaign ? (
        <div>
          {/* Campaign Image */}
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-64 object-cover rounded-md mb-6"
          />

          {/* Campaign Details */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{campaign.title}</h2>
          <p className="text-gray-600 mb-4">{campaign.description}</p>

          <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700 text-lg">🎯 Target: <span className="font-semibold">{campaign.target} ETH</span></p>
            <p className="text-gray-700 text-lg">💰 Raised: <span className="font-semibold">{campaign.amountCollected} ETH</span></p>
            <p className="text-gray-700 text-lg">⏳ Deadline: <span className="font-semibold">{campaign.deadline}</span></p>
            <p className="text-gray-700 text-lg">📍 Location: <span className="font-semibold">{campaign.state}, {campaign.region}</span></p>
          </div>

          {/* Donation Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">💖 Support This Campaign</h3>
            <input
              type="number"
              placeholder="Enter amount in ETH"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full p-3 border rounded-md text-gray-800"
            />
            <button
              onClick={handleDonate}
              disabled={processing}
              className={`w-full mt-3 p-3 text-white font-semibold rounded-md ${
                processing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition"
              }`}
            >
              {processing ? "Processing..." : "Donate Now"}
            </button>
          </div>

          {/* Donor List */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Donor List</h3>
            {donors.length > 0 ? (
              <ul className="border rounded-lg bg-gray-50 p-4">
                {donors.map((donor, index) => (
                  <li key={index} className="p-2 border-b last:border-none flex justify-between text-gray-700">
                    <span>{donor[0]}</span>
                    <span>{ethers.formatEther(donor[1])} ETH</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No donations yet. Be the first to contribute! 🎉</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Campaign not found.</p>
      )}
    </div>
  );
};

export default CampaignDetail;
