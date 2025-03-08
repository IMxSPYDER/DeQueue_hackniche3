import { ethers } from "ethers";
import contractABI from './abi.json'

const contractAddress = "0xd03907c2F32c99ad695e4FC3CD469C93871E3371"; // Replace with deployed contract address


export const getContract = () => {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};
