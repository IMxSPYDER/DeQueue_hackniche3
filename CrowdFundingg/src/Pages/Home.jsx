import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Contract/abi.json";
import CampaignCard from "../Components/CampaignCard"; // Import the Campaign Card
import { Link, useNavigate } from "react-router-dom";

// Replace with your contract address
const contractAddress = "0xCf5f44a1769fb65C59d9Aed2ED27202cf3493BbC";

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!window.ethereum) {
        alert("MetaMask is required to interact with this dApp!");
        return;
      }

      try {
        // Initialize provider and request account access
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        // Initialize contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Fetch all campaigns from the smart contract
        const allCampaigns = await contract.getAllCampaigns();
        console.log("Fetched Campaigns:", allCampaigns);

        // Extract first 4 campaigns for display
        const displayedCampaigns = allCampaigns.slice(0, 4).map((campaign, index) => ({
          id: index, // Add an ID if not present
          title: campaign.title,
          description: campaign.description,
          target: ethers.formatEther(campaign.target),
          amountCollected: ethers.formatEther(campaign.amountCollected),
          deadline: new Date(Number(campaign.deadline) * 1000).toLocaleDateString(),
          image: campaign.image,
          state: campaign.state,
          region: campaign.region,
        }));

        setCampaigns(displayedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
    <div className="h-screen bg-cover bg-top bg-no-repeat flex items-center justify-center" 
            // style={{ backgroundImage: `url(${image})` }}
            >
                <div className="max-w-[1250px] w-full flex flex-col items-center pt-[200px]">
                    <div className="flex flex-col items-center justify-center mb-[150px] h-64">
                        <div className="relative whitespace-nowrap">
                        
                            <h1 className="font-bold text-blue-950 text-6xl">Empower Change
                            <span className="relative whitespace-nowrap text-blue-600"><svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                            <span className="relative"> Fund Transparently</span>
                            </span>
                            {/* <span className="text-blue-500">Creative Minds</span> */}
                            </h1>
                            
                        </div>
                        <div className="mt-8 max-w-[850px] font-medium text-gray-700 text-2xl text-center">
                        Launch campaigns, <span className="font-bold text-gray-800">support causes, and <span className="text-blue-500">track funds securely</span></span> all in a transparent, direct way.








                        </div>
                        <div className="mt-8 flex items-center gap-8 justify-center">
                            <div className="px-1 py-2.5 text-white bg-blue-500 font-semibold rounded-md cursor-pointer">
                                <a href="#camp" className="px-4 py-1.5 hover:bg-blue-600 rounded-md">
                                    Explore Campaigns
                                </a>
                            </div>
                            <div className="px-1 py-2.5 border border-gray-200 bg-white/80 font-semibold rounded-md">
                                <Link to="/dashboard" className="text-gray-700 px-4 py-1.5 hover:bg-gray-100 rounded-md">
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    <div id="camp" className="mt-[12px] mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🚀 Latest Campaigns</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading campaigns...</p>
      ) : campaigns.length > 0 ? (
        <div className="flex flex-row gap-2">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No campaigns available.</p>
      )}

      {/* Button to View More Campaigns */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/campaigns")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all cursor-pointer"
        >
          🔍 View All Campaigns
        </button>
      </div>
    </div>
    </>
  );
};

export default HomePage;
