import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { useState } from 'react';
import { Menu, X } from "lucide-react";

const Navbar_m = ({ account, connectWallet, disconnectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const formatAccount = (address) => `${address.slice(0, 3)}...${address.slice(-4)}`;

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-black shadow-[0_4px_10px_rgba(128,0,128,0.7)] pb-5 z-50">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2 justify-between w-full md:w-auto">
        <Link
          to="/"
          className="flex gap-2 items-center justify-between border border-gray-700 rounded-lg px-3 py-2.5 bg-black/80 cursor-pointer"
        > 
          <img src={logo} alt="Logo" className='rounded-[50%] h-[25px] w-[25px]' />
          <span className="font-bold text-white">
            De<span className="text-purple-500">Fund</span>
          </span>
        </Link>

        {/* Desktop Navigation (Hidden on Small Screens) */}
      <div className="hidden md:flex space-x-4 border border-gray-700 rounded-lg px-3 py-1 bg-black/80">
        <Link to="/campaign" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
          All Campaigns
        </Link>
        <Link to="/blogs" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
          Blogs
        </Link>
        <Link to="/about-us" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
          About Us
        </Link>
        <Link to="" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
          Settings
        </Link>
      </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      

      {/* Desktop Right-Side Buttons (Hidden on Small Screens) */}
      <div className="hidden md:flex items-center space-x-6">
        {account ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">{formatAccount(account)}</span>
            <Link to="/dashboard" className="px-4 py-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md">
              Dashboard
            </Link>
            <button onClick={disconnectWallet} className="px-4 cursor-pointer py-2 text-white bg-red-500 hover:bg-red-700 rounded-md">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="px-4 cursor-pointer py-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md">
            Connect Wallet
          </button>
        )}
      </div>

      {/* Mobile Menu (Visible only when menuOpen is true) */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-700 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link to="/campaign" className="text-gray-300" onClick={() => setMenuOpen(false)}>All Campaigns</Link>
            <Link to="/blogs" className="text-gray-300" onClick={() => setMenuOpen(false)}>Blogs</Link>
            <Link to="/about-us" className="text-gray-300" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="" className="text-gray-300" onClick={() => setMenuOpen(false)}>Settings</Link>

            {/* Wallet Buttons in Mobile Menu */}
            {account ? (
              <div className="flex flex-col space-y-3 mt-4">
                <span className="text-gray-300">{formatAccount(account)}</span>
                <Link to="/dashboard" className="px-4 py-2 bg-purple-600 text-white rounded-md text-center" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={disconnectWallet} className="px-4 py-2 bg-red-500 text-white rounded-md">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="px-4 py-2 bg-purple-600 text-white rounded-md mt-4">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
      
    </nav>
  );
};

export default Navbar_m;
