import { Link } from 'react-router-dom';

const Navbar = ({ account, connectWallet }) => {
  const formatAccount = (address) => {
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-black shadow-[0_4px_10px_rgba(128,0,128,0.7)] pb-5 z-50">
      {/* Logo Section */}
      <div className="flex justify-between space-x-2">
        <Link
          to="/"
          className="flex gap-2 items-center justify-between border border-gray-700 rounded-lg px-3 py-1 bg-black/80 cursor-pointer"
        >
          <span className="font-bold text-white">
            De<span className="text-purple-500">Fund</span>
          </span>
        </Link>
        <div className="flex space-x-4 border border-gray-700 rounded-lg px-3 py-1 bg-black/80">
          <Link to="/campaign" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
            All Campaigns
          </Link>
          <Link to="/applied_jobs" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
            My Applications
          </Link>
          <Link to="/about-us" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
            About Us
          </Link>
          <Link to="" className="text-gray-300 p-2 px-3 hover:bg-purple-700 font-medium rounded-md">
            Settings
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex items-center space-x-6">
        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3 gap-2">
          {account ? (
            <Link to="/dashboard" className="px-4 cursor-pointer py-2.5 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md">
              Dashboard
            </Link>
          ) : (
            <button onClick={connectWallet} className="px-4 cursor-pointer py-2.5 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md">
              Connect to Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
