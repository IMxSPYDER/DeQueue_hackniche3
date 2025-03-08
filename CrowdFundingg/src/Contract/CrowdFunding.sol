// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecentralizedCrowdfunding {
    enum Category { Health, Disaster, Crisis, Education, Environment }

    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 fundsRaised;
        bool claimed;
        Category category;
        string imageUrl; // 🆕 Stores image URL
        string videoUrl; // 🆕 Stores video URL
        mapping(address => uint256) contributions;
        address[] donors;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(Category => uint256[]) public categoryCampaigns;
    mapping(address => uint256[]) public userCampaigns;
    mapping(address => uint256[]) public userDonatedCampaigns;

    event CampaignCreated(
        uint256 campaignId, 
        address creator, 
        uint256 goal, 
        uint256 deadline, 
        Category category, 
        string imageUrl, 
        string videoUrl
    );
    
    event ContributionReceived(uint256 campaignId, address contributor, uint256 amount);
    event FundsClaimed(uint256 campaignId, address creator, uint256 amount);
    event RefundIssued(uint256 campaignId, address contributor, uint256 amount);

    modifier onlyCreator(uint256 _campaignId) {
        require(msg.sender == campaigns[_campaignId].creator, "Not the campaign creator");
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        _;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration,
        Category _category,
        string memory _imageUrl,  // 🆕 Image URL instead of IPFS hash
        string memory _videoUrl   // 🆕 Video URL instead of IPFS hash
    ) external {
        require(_goal > 0, "Goal must be greater than zero");
        require(_duration > 0, "Duration must be positive");
        require(bytes(_imageUrl).length > 0, "Image URL is required");
        require(bytes(_videoUrl).length > 0, "Video URL is required");

        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + _duration;
        newCampaign.claimed = false;
        newCampaign.category = _category;
        newCampaign.imageUrl = _imageUrl;  // Store image URL
        newCampaign.videoUrl = _videoUrl;  // Store video URL

        categoryCampaigns[_category].push(campaignCount);
        userCampaigns[msg.sender].push(campaignCount); // Store campaigns created by user

        emit CampaignCreated(campaignCount, msg.sender, _goal, newCampaign.deadline, _category, _imageUrl, _videoUrl);
        campaignCount++;
    }

    function contribute(uint256 _campaignId) external payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than zero");

        // If it's the user's first contribution, add to donors list
        if (campaign.contributions[msg.sender] == 0) {
            campaign.donors.push(msg.sender);
            userDonatedCampaigns[msg.sender].push(_campaignId); // Store campaigns donated by user
        }

        campaign.contributions[msg.sender] += msg.value;
        campaign.fundsRaised += msg.value;

        emit ContributionReceived(_campaignId, msg.sender, msg.value);
    }

    function claimFunds(uint256 _campaignId) external onlyCreator(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign is still running");
        require(campaign.fundsRaised >= campaign.goal, "Funding goal not met");
        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        uint256 amount = campaign.fundsRaised;
        campaign.fundsRaised = 0;
        payable(msg.sender).transfer(amount);

        emit FundsClaimed(_campaignId, msg.sender, amount);
    }

    function requestRefund(uint256 _campaignId) external campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign is still running");
        require(campaign.fundsRaised < campaign.goal, "Funding goal met, no refunds");

        uint256 contribution = campaign.contributions[msg.sender];
        require(contribution > 0, "No contributions found");

        campaign.contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contribution);

        emit RefundIssued(_campaignId, msg.sender, contribution);
    }

    function getCampaignsByCategory(Category _category) external view returns (uint256[] memory) {
        return categoryCampaigns[_category];
    }

    // **New Function: Get all campaigns created by a user**
    function getCampaignsByCreator(address _creator) external view returns (uint256[] memory) {
        return userCampaigns[_creator];
    }

    // **New Function: Get all campaigns a user has donated to**
    function getCampaignsDonatedByUser(address _donor) external view returns (uint256[] memory) {
        return userDonatedCampaigns[_donor];
    }

    // **New Function: Get all donors of a campaign**
    function getDonors(uint256 _campaignId) external view campaignExists(_campaignId) returns (address[] memory) {
        return campaigns[_campaignId].donors;
    }

    // **New Function: Get campaign media links**
    function getCampaignMedia(uint256 _campaignId) external view campaignExists(_campaignId) returns (string memory, string memory) {
        return (campaigns[_campaignId].imageUrl, campaigns[_campaignId].videoUrl);
    }
}
