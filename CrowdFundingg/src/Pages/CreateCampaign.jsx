import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../Contract/abi.json';

const CreateCampaign = ({ closeModal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [category, setCategory] = useState('');

    const createCampaign = async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask!');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractAddress = '0x0d01AAb8a941F48371A72C1f1858fbe77630660D'; // Your contract address
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // ✅ Convert goal from Ether to Wei
            const goalInWei = ethers.parseEther(goal.toString());

            // ✅ Convert duration from days to seconds
            const durationInSeconds = duration * 86400; // Assuming `duration` is in days

            // ✅ Ensure category is an integer (ENUM in Solidity)
            const categoryIndex = parseInt(category);

            console.log('Creating campaign with values:', {
                title,
                description,
                goalInWei,
                durationInSeconds,
                categoryIndex,
                imageUrl,
                videoUrl
            });

            const tx = await contract.createCampaign(
                title,
                description,
                goalInWei,
                durationInSeconds,
                categoryIndex,  // ✅ Make sure this is an integer
                imageUrl,  // ✅ Ensure this is a string
                videoUrl,  // ✅ Ensure this is a string
                {
                    gasLimit: 8000000, // Adjust based on contract requirements
                }
            );

            await tx.wait(); // Wait for the transaction to be confirmed
            console.log('Campaign created successfully', tx);
            alert('Campaign created successfully!');
            closeModal();
        } catch (error) {
            alert('Failed to create campaign');
            console.error('Error creating campaign:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createCampaign();
        setTitle('');
        setDescription('');
        setGoal('');
        setDuration('');
        setImageUrl('');
        setVideoUrl('');
        setCategory('');
    };

    return (
        <div className="fixed p-12 inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg relative h-[90vh] overflow-y-scroll hide-scrollbar">
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">✕</button>
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create a New Campaign</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex flex-col w-1/2">
                            <label className="text-sm font-semibold text-gray-600">Funding Goal (in Ether):</label>
                            <input
                                type="number"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="text-sm font-semibold text-gray-600">Duration (in Days):</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">Image URL:</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">Video URL:</label>
                        <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">Category:</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500"
                            required
                        >
                            <option value="">Select a Category</option>
                            <option value="0">Health</option>
                            <option value="1">Disaster</option>
                            <option value="2">Crisis</option>
                            <option value="3">Education</option>
                            <option value="4">Environment</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;
