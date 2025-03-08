import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import crowdfundingABI from "../Contract/abi.json";

const contractAddress = "0xd03907c2F32c99ad695e4FC3CD469C93871E3371";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const loadCampaign = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, crowdfundingABI.abi, provider);
      const data = await contract.campaigns(id);
      setCampaign({ ...data });
    };
    if (window.ethereum) {
      loadCampaign();
    }
  }, [id]);

  if (!campaign) return <p>Loading...</p>;

  return (
    <div>
      <h1>{campaign.title}</h1>
      <img src={campaign.imageUrl} alt={campaign.title} />
      <p>{campaign.description}</p>
      <p>Goal: {ethers.utils.formatEther(campaign.goal)} ETH</p>
      <p>Raised: {ethers.utils.formatEther(campaign.fundsRaised)} ETH</p>
    </div>
  );
};

export default CampaignDetail;
