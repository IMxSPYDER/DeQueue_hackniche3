import { useState } from "react";
import { ethers } from "ethers";
import crowdfundingABI from "../Contract/abi.json";

const contractAddress = "0x0d01AAb8a941F48371A72C1f1858fbe77630660D";

const CreateCampaign = ({ account }) => {
  const [form, setForm] = useState({ title: "", description: "", goal: "", duration: "", category: 0, imageUrl: "", videoUrl: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return alert("Connect Wallet First!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, crowdfundingABI.abi, signer);

    const goalInWei = ethers.utils.parseEther(form.goal);
    const durationInSeconds = Number(form.duration) * 86400;

    try {
      const tx = await contract.createCampaign(
        form.title,
        form.description,
        goalInWei,
        durationInSeconds,
        form.category,
        form.imageUrl,
        form.videoUrl
      );
      await tx.wait();
      alert("Campaign Created!");
    } catch (error) {
      console.error("Error creating campaign", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <input type="text" placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      <input type="number" placeholder="Goal (ETH)" onChange={(e) => setForm({ ...form, goal: e.target.value })} required />
      <input type="number" placeholder="Duration (Days)" onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
      <input type="url" placeholder="Image URL" onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
      <input type="url" placeholder="Video URL" onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required />
      <button type="submit">Create Campaign</button>
    </form>
  );
};

export default CreateCampaign;
