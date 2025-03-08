import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Contract/abi.json";
import { Link } from "react-router-dom"; // Assuming routing is used

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            if (typeof window.ethereum === "undefined") {
                console.error("MetaMask is not installed.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractAddress = "0x0d01AAb8a941F48371A72C1f1858fbe77630660D"; // Your contract address
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            try {
                const allCampaigns = await contract.getAllCampaigns();
                setCampaigns(allCampaigns);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="container mt-[100px] mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Trending Campaigns</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {campaigns.slice(0, 4).map((campaign, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-4">
                        <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-40 object-cover rounded-md mb-3" />
                        <h2 className="text-lg font-semibold">{campaign.title}</h2>
                        <p className="text-gray-600 text-sm line-clamp-2">{campaign.description}</p>
                        <p className="text-blue-600 font-semibold mt-2">Goal: {ethers.formatEther(campaign.goal)} ETH</p>
                        <Link to={`/campaign/${index}`} className="mt-3 inline-block text-white bg-blue-500 px-4 py-2 rounded-md text-sm hover:bg-blue-600">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            {/* View More Button */}
            {campaigns.length > 4 && (
                <div className="text-center mt-6">
                    <Link to="/all-campaigns" className="text-blue-500 hover:underline font-semibold">
                        View More Campaigns →
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
