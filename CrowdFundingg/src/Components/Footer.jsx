import { FaTwitter, FaLinkedin, FaGithub, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#191919] text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">De<span className="text-purple-500">Fund</span></h2>
          <p className="mt-3 text-gray-500">
            A decentralized crowdfunding platform empowering communities to raise funds securely and transparently.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/campaign" className="hover:text-purple-400 transition">All Campaigns</Link>
          <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>
          <Link to="/about" className="hover:text-purple-400 transition">About Us</Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-xl hover:text-purple-400 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-xl hover:text-purple-400 transition" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-xl hover:text-purple-400 transition" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <FaTelegram className="text-xl hover:text-purple-400 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-10 border-t border-gray-700 text-center pt-6">
        <p className="text-sm">© {new Date().getFullYear()} DeFund. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
