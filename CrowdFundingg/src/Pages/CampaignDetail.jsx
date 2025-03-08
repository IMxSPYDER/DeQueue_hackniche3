import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import contractABI from "../Contract/abi.json";
import { color } from "framer-motion";

const contractAddress = "0xCf5f44a1769fb65C59d9Aed2ED27202cf3493BbC";

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
    
        // ✅ Fetch campaign safely
        const campaignData = await contract.campaigns(id);
        if (!campaignData) throw new Error("Invalid campaign data");
    
        // ✅ Fetch donors safely
        let donorAddresses = [];
        let donationAmounts = [];
        try {
          const donorsResult = await contract.getDonors(id);
          
          // Ensure donorsResult is structured as expected
          if (donorsResult.length === 2) {
            donorAddresses = donorsResult[0];
            donationAmounts = donorsResult[1];
          }
    
          console.log("Processed Donors:", donorAddresses, donationAmounts);
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
          image: campaignData.image || "https://via.placeholder.com/300",
          state: campaignData.state || "Unknown",
          region: campaignData.region || "Unknown",
        });
    
        // ✅ Fix Donor List Formatting
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
              className={`w-full cursor-pointer mt-3 p-3 text-white font-semibold rounded-md ${
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
    <ul className="border rounded-lg bg-gray-50 p-1">
    {donors.map((donor, index) => {
  // Generate a random light background color
  const randomBgColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 90%)`; // Light pastel colors
  const textColor = "#333"; // Dark text color

  return (
    <li key={index} className="p-2 border-b last:border-none flex align-center justify-between text-gray-700">
      <span>{donor.address}</span>
      <span className="font-bold" style={{ color: textColor, backgroundColor: randomBgColor, padding: "5px 10px", borderRadius: "25px" }}>
        {donor.amount} ETH
      </span>
    </li>
  );
})}

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
