import { ethers } from "ethers";
import contractABI from './abi.json'

const contractAddress = "0x84c35E54f54BBb44c3Fb40d6E4d477B3E580F8a7"; // Replace with deployed contract address


export const getContract = () => {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};
