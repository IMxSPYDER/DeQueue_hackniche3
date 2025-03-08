import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CreateCampaign from "./Pages/CreateCampaign";
import CampaignDetail from "./Pages/CampaignDetail";
import Dashboard from "./Pages/Dashboard";
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar.jsX";
import { ethers } from "ethers";
import contractABI from './Contract/abi.json'



function App() {
  const [account, setAccount] = useState(null);

  const contractAddress = '0xd03907c2F32c99ad695e4FC3CD469C93871E3371'; // Replace with your contract address
  

  // Function to connect wallet and prompt account selection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account permissions to force MetaMask to show account selection
        const accounts = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        }).then(() =>
          window.ethereum.request({ method: 'eth_accounts' })
        );
        setAccount(accounts[0]); // Set to the first selected account
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert('MetaMask not detected. Please install it.');
    }
  };

  // Check if a wallet is already connected on load
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const getContract = () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  return (
    <Router>
      <Navbar account={account} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={<Home contract={getContract()} />} />
        <Route path="/create-campaign" element={<CreateCampaign contract={getContract()} />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
