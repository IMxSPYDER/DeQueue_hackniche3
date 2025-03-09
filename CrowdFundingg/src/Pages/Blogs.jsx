import { useState } from "react";
import { motion } from "framer-motion";

export default function Blogs() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="min-h-screen mt-[80px] bg-black text-white px-6 py-12">
      {/* Page Title */}
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        DeFund Blog
      </motion.h1>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Blog Post 1 */}
        <motion.div
          className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="https://akeo.tech/wp-content/uploads/2021/09/Tokenization-and-Crowdfunding.webp"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h2 className="text-xl font-semibold">
              How DeFund is Changing Crowdfunding Forever
            </h2>
            <p className="text-gray-400 text-sm mt-1">March 10, 2025</p>
            <p className="text-gray-300 mt-3">
              Discover how blockchain and decentralization are making
              fundraising more transparent and accessible.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-500 cursor-pointer text-white px-4 py-2 rounded transition-all"
              onClick={() =>
                setSelectedPost({
                  title: "How DeFund is Changing Crowdfunding Forever",
                  date: "March 10, 2025",
                  description:
                    "Discover how blockchain and decentralization are making fundraising more transparent and accessible.",
                })
              }
            >
              Read More
            </button>
          </div>
        </motion.div>

        {/* Blog Post 2 */}
        <motion.div
          className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="https://digiskillzz.com/wp-content/uploads/2023/05/How-to-run-marketing-campaign20-jpg.webp"
            alt="Top 5 Tips for Running a Successful Campaign"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h2 className="text-xl font-semibold">
              Top 5 Tips for Running a Successful Campaign
            </h2>
            <p className="text-gray-400 text-sm mt-1">March 5, 2025</p>
            <p className="text-gray-300 mt-3">
              Learn the secrets to creating a crowdfunding campaign that
              attracts backers and reaches its goal.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 cursor-pointer rounded transition-all"
              onClick={() =>
                setSelectedPost({
                  title: "Top 5 Tips for Running a Successful Campaign",
                  date: "March 5, 2025",
                  description:
                    "Learn the secrets to creating a crowdfunding campaign that attracts backers and reaches its goal.",
                })
              }
            >
              Read More
            </button>
          </div>
        </motion.div>

        {/* Blog Post 3 */}
        <motion.div
          className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="https://www.indusnet.co.in/site/wp-content/uploads/2023/08/unnamed-43.png"
            alt="The Future of Crowdfunding: Trends for 2025"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h2 className="text-xl font-semibold">
              The Future of Crowdfunding: Trends for 2025
            </h2>
            <p className="text-gray-400 text-sm mt-1">February 28, 2025</p>
            <p className="text-gray-300 mt-3">
              Explore upcoming trends in the crowdfunding industry and how they
              impact creators and investors.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 cursor-pointer rounded transition-all"
              onClick={() =>
                setSelectedPost({
                  title: "The Future of Crowdfunding: Trends for 2025",
                  date: "February 28, 2025",
                  description:
                    "Explore upcoming trends in the crowdfunding industry and how they impact creators and investors.",
                })
              }
            >
              Read More
            </button>
          </div>
        </motion.div>
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-900 p-6 rounded-xl max-w-2xl text-center">
            <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
            <p className="text-gray-400 text-sm mt-2">{selectedPost.date}</p>
            <p className="text-gray-300 mt-4">{selectedPost.description}</p>
            <button
              className="mt-6 bg-red-600 hover:bg-red-500 px-4 py-2 cursor-pointer rounded"
              onClick={() => setSelectedPost(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
