import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { FiImage, FiUpload } from "react-icons/fi";

const PINATA_API_KEY = "d3c1374dd7d3b0100487";
const PINATA_SECRET_API_KEY = "29bd31b1bda7a2939e69ca4c1020293017221fb6bac3b91a35ef6d082c6b2b5d";

const CreateCampaign = ({ contract }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    state: "",
    region: "",
    image: "", // Will store IPFS CID
  });

  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!contract) {
      console.warn("Smart contract is not loaded!");
    }
  }, [contract]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
        body: formData,
      });

      const result = await response.json();
      const ipfsHash = result.IpfsHash; // CID of the uploaded file
      const ipfsURL = `https://ipfs.io/ipfs/${ipfsHash}`;

      setForm({ ...form, image: ipfsHash }); // Store CID in state
      setImagePreview(ipfsURL);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      alert("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
  
    if (!contract) {
      alert("Smart contract is not loaded!");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
  
      const tx = await contractWithSigner.createCampaign(
        form.title,
        form.description,
        ethers.parseUnits(form.target, "ether"),
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.state,
        form.region,
        form.image // Store IPFS CID instead of URL
      );
  
      await tx.wait();
      alert("🎉 Campaign created successfully!");
  
      setForm({ title: "", description: "", target: "", deadline: "", state: "", region: "", image: "" });
      setImagePreview("");
  
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("⚠️ Failed to create campaign.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200 mt-[120px] mb-[20px] overflow-x"
    >
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">🚀 Start a Campaign</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Campaign Title" value={form.title} onChange={handleChange} className="border p-3 rounded-md focus:outline-blue-500" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" className="border p-3 rounded-md focus:outline-blue-500" required />
        <div className="relative">
          <input type="text" name="target" placeholder="Target (ETH)" value={form.target} onChange={handleChange} className="border p-3 rounded-md w-full pr-10 focus:outline-blue-500" required />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">ETH</span>
        </div>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="border p-3 rounded-md focus:outline-blue-500" required />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} className="border p-3 rounded-md focus:outline-blue-500" required />
          <input type="text" name="region" placeholder="Region" value={form.region} onChange={handleChange} className="border p-3 rounded-md focus:outline-blue-500" required />
        </div>
        
        {/* Image Upload Section */}
        <div className="relative flex items-center gap-3 border p-3 rounded-md">
          <FiImage className="text-gray-500 text-xl" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full focus:outline-none" />
        </div>

        {/* Image Preview */}
        {uploading ? (
          <p className="text-blue-500">Uploading...</p>
        ) : (
          imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md shadow-md" />
        )}

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-md font-semibold flex items-center justify-center gap-2">
          <FiUpload className="text-lg" /> Create Campaign
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateCampaign;
