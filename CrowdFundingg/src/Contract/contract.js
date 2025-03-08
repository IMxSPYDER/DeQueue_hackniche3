import { ethers } from "ethers";
import contractABI from './abi.json'

const contractAddress = "0x0d01AAb8a941F48371A72C1f1858fbe77630660D"; // Replace with deployed contract address


export const getContract = () => {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};
