import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import contractABI from "../Contract/abi.json";
import { FiTarget, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const contractAddress = "0x84c35E54f54BBb44c3Fb40d6E4d477B3E580F8a7";

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
        alert("MetaMask is required!");
        return;
      }

      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const campaignData = await contract.campaigns(id);
        if (!campaignData) throw new Error("Invalid campaign data");

        let imageUrl = campaignData.image || "";
        if (imageUrl.startsWith("Qm") || imageUrl.startsWith("bafy")) {
          imageUrl = `https://ipfs.io/ipfs/${imageUrl}`;
        }

        let donorAddresses = [];
        let donationAmounts = [];
        try {
          const donorsResult = await contract.getDonors(id);
          if (donorsResult.length === 2) {
            donorAddresses = donorsResult[0];
            donationAmounts = donorsResult[1];
          }
        } catch (err) {
          console.warn("Error fetching donors:", err);
        }

        setCampaign({
          title: campaignData.title || "Untitled",
          target: ethers.formatEther(campaignData.target.toString()),
          description: campaignData.description || "No description available.",
          amountCollected: ethers.formatEther(campaignData.amountCollected.toString()),
          deadline:
            campaignData.deadline > 0
              ? new Date(Number(campaignData.deadline) * 1000).toLocaleDateString()
              : "N/A",
          image: imageUrl || "https://via.placeholder.com/300",
          state: campaignData.state || "Unknown",
          region: campaignData.region || "Unknown",
        });

        const formattedDonors = donorAddresses.map((address, index) => ({
          address: address,
          amount: donationAmounts[index] ? ethers.formatEther(donationAmounts[index]) : "0",
        }));

        setDonors(formattedDonors);
      } catch (error) {
        console.error("Error fetching details:", error);
        alert("Failed to load campaign details.");
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

      const tx = await contract.contribute(id, {
        value: ethers.parseEther(donationAmount),
      });

      await tx.wait();
      alert("Donation Successful! 🎉");

      window.location.reload();
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Transaction failed! ❌");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-black p-5">
    <div className="max-w-5xl mb-[20px] mt-[100px] mx-auto p-6 bg-gray-900 text-white shadow-lg rounded-lg">
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : campaign ? (
        <div>
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-64 object-cover rounded-md mb-6 border border-gray-700"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }} 
          />

          <h2 className="text-3xl font-bold text-white mb-2">{campaign.title}</h2>
          <p className="text-gray-400 mb-4">{campaign.description}</p>

          <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="flex gap-1 font-bold items-center text-gray-300 text-lg">
              <FiTarget className="text-gray-400 text-xl" /> Target: 
              <span className="font-semibold text-white">{campaign.target} ETH</span>
            </p>
            <p className="flex gap-1 font-bold items-center text-gray-300 text-lg">
              <FiDollarSign className="text-gray-400 text-xl" /> Raised: 
              <span className="font-semibold text-white">{campaign.amountCollected} ETH</span>
            </p>
            <p className="flex gap-1 font-bold items-center text-gray-300 text-lg">
              <FiClock className="text-gray-400 text-xl" /> Deadline: 
              <span className="font-semibold text-white">{campaign.deadline}</span>
            </p>
            <p className="flex gap-1 font-bold items-center text-gray-300 text-lg">
              <FiMapPin className="text-gray-400 text-xl" /> Location: 
              <span className="font-semibold text-white">{campaign.state}, {campaign.region}</span>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">💖 Support This Campaign</h3>
            <input
              type="number"
              placeholder="Enter amount in ETH"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <button
              onClick={handleDonate}
              disabled={processing}
              className={`w-full cursor-pointer mt-3 p-3 text-white font-semibold rounded-md ${
                processing ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 transition"
              }`}
            >
              {processing ? "Processing..." : "Donate Now"}
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">👥 Donor List</h3>
            {donors.length > 0 ? (
              <ul className="border border-gray-700 rounded-lg bg-gray-800 p-1">
                {donors.map((donor, index) => (
                  <li key={index} className="p-2 border-b border-gray-700 last:border-none flex justify-between text-gray-300">
                    <span>{donor.address}</span>
                    <span className="font-bold bg-gray-700 px-3 py-1 rounded-md">{donor.amount} ETH</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No donations yet. Be the first to contribute! 🎉</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400">Campaign not found.</p>
      )}
    </div>
    </div>
  );
};

export default CampaignDetail;
