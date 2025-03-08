import { Link } from 'react-router-dom';

const Navbar = ({ account, connectWallet }) => {
  const formatAccount = (address) => {
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-white shadow-lg pb-5 z-50">
      {/* Logo Section */}
      <div className="flex justify-between space-x-2">
        <Link
          to="/"
          className="flex gap-2 items-center justify-between border border-gray-200 rounded-lg px-3 py-1 bg-white/80 cursor-pointer"
        >
          <span className="font-bold">
            De<span className="text-blue-500">Fund</span>
          </span>
        </Link>
        <div className="flex space-x-4 border border-gray-200 rounded-lg px-3 py-1 bg-white/80">
          <Link to="/campaign" className="text-gray-700 p-2 px-3 hover:bg-gray-100 font-medium rounded-md">
            All Campaigns
          </Link>
          {/* <Link to="/find-job" className="text-gray-700 p-2 px-3 hover:bg-gray-100 font-medium rounded-md">
          </Link> */}
          <Link to="/applied_jobs" className="text-gray-700 p-2 px-3 hover:bg-gray-100 font-medium rounded-md">
            My Applications
          </Link>
          <Link to="/pricing" className="text-gray-700 p-2 px-3 hover:bg-gray-100 font-medium rounded-md">
            About Us
          </Link>
          <Link to="" className="text-gray-700 p-2 px-3 hover:bg-gray-100 font-medium rounded-md">
            Settings
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex items-center space-x-6">
        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3 gap-2">
          {account ? (
            <Link to="/dashboard" className="px-4 py-2.5 text-white font-semibold bg-blue-500 rounded-md">
              Dashboard
            </Link>
          ) : (
            <button onClick={connectWallet} className="px-4 py-2.5 text-white font-semibold bg-blue-500 rounded-md">
              Connect to Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
