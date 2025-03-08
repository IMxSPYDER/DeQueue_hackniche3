import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import crowdfundingABI from "../Contract/abi.json";

const contractAddress = "0x0d01AAb8a941F48371A72C1f1858fbe77630660D"; // Replace with actual contract

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const contractInstance = new ethers.Contract(contractAddress, crowdfundingABI.abi, web3Provider);
      setContract(contractInstance);

      const campaignCount = await contractInstance.campaignCount();
      const loadedCampaigns = [];

      for (let i = 0; i < campaignCount; i++) {
        const campaign = await contractInstance.campaigns(i);
        loadedCampaigns.push({ id: i, ...campaign });
      }

      setCampaigns(loadedCampaigns);
    };

    if (window.ethereum) {
      loadBlockchainData();
    }
  }, []);

  return (
    <div className="mt-[120px]">
      <h1 className="text-3xl font-bold mb-4">Active Campaigns</h1>
      <div className="grid grid-cols-3 gap-4">
        {campaigns.map((campaign, index) => (
          <Link to={`/campaign/${index}`} key={index} className="p-4 border rounded-lg">
            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-40 object-cover mb-2" />
            <h2 className="text-xl font-semibold">{campaign.title}</h2>
            <p>Goal: {ethers.utils.formatEther(campaign.goal)} ETH</p>
            <p>Raised: {ethers.utils.formatEther(campaign.fundsRaised)} ETH</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
