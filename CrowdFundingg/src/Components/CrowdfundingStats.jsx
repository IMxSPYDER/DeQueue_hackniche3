import React from 'react'

function CrowdfundingStats() {
    return (
        <div className="bg-[#191919] mt-[80px] text-white py-16 px-6">
          <h2 className="text-4xl font-bold text-center mb-4">
            The Future of Crowdfunding Starts Here!
          </h2>
          <p className="text-center text-gray-400 text-lg mb-10">
            Join us in funding innovation, creativity, and impact—one pledge at a time.
          </p>
    
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center border border-gray-700">
              <p className="text-4xl font-extrabold text-purple-500">+150</p>
              <p className="text-gray-400 text-lg">Total Backers</p>
            </div>
    
            {/* Total Campaigns */}
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center border border-gray-700">
              <p className="text-4xl font-extrabold text-purple-500">+250</p>
              <p className="text-gray-400 text-lg">Campaigns Launched</p>
            </div>
    
            {/* Total Funds Raised */}
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center border border-gray-700">
              <p className="text-4xl font-extrabold text-purple-500">+$1500</p>
              <p className="text-gray-400 text-lg">Funds Raised</p>
            </div>
          </div>
    
          <p className="text-center text-gray-500 text-sm mt-8 italic">
            Be the first to launch a campaign and make an impact! 🌍✨
          </p>
        </div>
      );
}

export default CrowdfundingStats
