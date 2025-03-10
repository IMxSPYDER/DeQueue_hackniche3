import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();

  let imageUrl = campaign.image || "";

  // Check if image is an IPFS hash and convert to URL
  if (imageUrl.startsWith("Qm") || imageUrl.startsWith("bafy")) {
    imageUrl = `https://ipfs.io/ipfs/${imageUrl}`;
  }

  return (
    <motion.div
      key={campaign.id}
      onClick={() => navigate(`/campaign/${campaign.id}`)}
      className="relative bg-[#191919]backdrop-blur-lg shadow-lg rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.08] hover:shadow-2xl transition-all duration-300 w-[310px] border border-gray-800"
      whileHover={{ scale: 0.95 }}
    >
      {/* Image with Gradient Overlay */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={campaign.title}
          className="w-full h-60 object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        {/* Floating Location Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-md">
          📍 {campaign.state}, {campaign.region}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h2 className="text-xl font-extrabold text-white">
          {campaign.title.length > 20 ? `${campaign.title.slice(0, 20)}...` : campaign.title}
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          {campaign.description.substring(0, 90)}...
        </p>

        {/* Campaign Details with Icons */}
        <div className="mt-4 flex flex-wrap justify-between items-center text-gray-400 text-sm">
          <p className="flex items-center">
            🎯 <span className="ml-1">Target: {campaign.target} ETH</span>
          </p>
          <p className="flex items-center">
            💰 <span className="ml-1">Raised: {campaign.amountCollected} ETH</span>
          </p>
        </div>

        {/* Deadline + Status */}
        <div className="mt-2 flex items-center justify-between text-gray-500 text-xs">
          <p>⏳ {campaign.deadline}</p>
          <p className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
            Live
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
