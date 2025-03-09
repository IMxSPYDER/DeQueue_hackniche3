import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaGlobe, FaLock, FaMoneyBillWave, FaBolt, FaUsers, FaLightbulb, FaHandHoldingUsd, FaChartLine } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen">
      {/* Hero Section */}
      <div className="relative mt-[85px] flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-500">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white flex items-center gap-3">
          <FaRocket /> Fueling Dreams, Empowering Change
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          A decentralized crowdfunding platform where ideas thrive, innovation is funded, and dreams become reality.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-6 px-6 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:bg-gray-300 transition"
        >
          <Link to="/create-campaign">Start a Campaign</Link>
        </motion.button>
      </div>

      {/* Why We Exist */}
      <div className="max-w-5xl mx-auto text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-white mb-6">Why We Exist</h2>
        <p className="text-lg text-gray-400">
          Traditional crowdfunding is slow, expensive, and restrictive. We’re here to change the game with <b>blockchain-powered, borderless</b> funding.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto text-center grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-10">
        {[
          { icon: <FaGlobe />, title: "Decentralized & Transparent", desc: "Every transaction is recorded on the blockchain—ensuring security, trust, and zero fraud." },
          { icon: <FaGlobe />, title: "Global & Borderless", desc: "No banking restrictions. Anyone, anywhere can launch a campaign or contribute using crypto." },
          { icon: <FaLock />, title: "Secure Smart Contracts", desc: "Funds are released only when conditions are met—protecting backers and campaign creators alike." },
          { icon: <FaMoneyBillWave />, title: "Low Fees & Instant Payments", desc: "No hefty cuts or long wait times. Your funds are available instantly, with minimal transaction fees." },
          { icon: <FaBolt />, title: "Fast & Easy Campaign Setup", desc: "Create your campaign in minutes and start raising funds without complex approvals." },
          { icon: <FaUsers />, title: "Community Driven", desc: "Backers and creators collaborate in a trusted ecosystem designed to fuel real-world impact." },
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center align-center justify-center"
          >
            <div className="text-purple-400 text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="mt-3 text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <div className="text-center py-16 px-6 bg-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaLightbulb />, title: "Launch a Campaign", desc: "Set your funding goal, upload details, and share your vision with the world." },
            { icon: <FaHandHoldingUsd />, title: "Receive Crypto Donations", desc: "Backers from anywhere in the world can fund your project instantly." },
            { icon: <FaChartLine />, title: "Make an Impact", desc: "Your dream becomes a reality, powered by blockchain transparency." },
          ].map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center align-center justify-center"
            >
              <div className="text-purple-400 text-4xl mb-4">{step.icon}</div>
              <h4 className="text-xl font-semibold text-white mt-2">{step.title}</h4>
              <p className="mt-3 text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Join Section */}
      <div className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-white mb-4">Join the Future of Crowdfunding</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Whether you're a creator looking for funding or a supporter who wants to make a difference, <b>[Your Platform Name]</b> is the place for you.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition"
        >
          <Link to="/create-campaign">Get Started</Link>
        </motion.button>
      </div>
    </div>
  );
};

export default AboutUs;
