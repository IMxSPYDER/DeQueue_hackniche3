import { useState } from "react";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "How DeFund is Changing Crowdfunding Forever",
    description:
      "Discover how blockchain and decentralization are making fundraising more transparent and accessible.",
    image: "https://www.capterra.com/assets-bx-capterra/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fpx6a31ta05xu%2Fwp-media-40677%2F85eba93f5e95ee7a97c9a6ea15de8962%2FCrowdfunding.PNG&w=3840&q=75",
    date: "March 10, 2025",
  },
  {
    id: 2,
    title: "Top 5 Tips for Running a Successful Campaign",
    description:
      "Learn the secrets to creating a crowdfunding campaign that attracts backers and reaches its goal.",
    image: "https://source.unsplash.com/600x400/?startup,business",
    date: "March 5, 2025",
  },
  {
    id: 3,
    title: "The Future of Crowdfunding: Trends for 2025",
    description:
      "Explore upcoming trends in the crowdfunding industry and how they impact creators and investors.",
    image: "https://source.unsplash.com/600x400/?future,technology",
    date: "February 28, 2025",
  },
];

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
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{post.date}</p>
              <p className="text-gray-300 mt-3">{post.description}</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-all"
                onClick={() => setSelectedPost(post)}
              >
                Read More
              </button>
            </div>
          </motion.div>
        ))}
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
              className="mt-6 bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
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
