// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// OpenZeppelin's ReentrancyGuard (flattened)
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// OpenZeppelin's MerkleProof (flattened)
library MerkleProof {
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == root;
    }
}

// Main Crowdfunding Contract
contract CrowdfundingPlatform is ReentrancyGuard {
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string state;
        string region;
        string image;
        bool isCompleted;
        address[] contributors;
    }

    struct CampaignInfo {
        address creator;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string state;
        string region;
        string image;
        bool isCompleted;
        address[] contributors;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(uint256 campaignId, address creator, uint256 target, uint256 deadline);
    event ContributionReceived(uint256 campaignId, address contributor, uint256 amount);
    event FundsWithdrawn(uint256 campaignId, uint256 amount);

    // ZKP Merkle Root for Proof Verification
    bytes32 public merkleRoot;

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _state,
        string memory _region,
        string memory _image
    ) public returns (uint256) {
        require(_target > 0, "Target amount must be greater than zero");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Campaign storage newCampaign = campaigns[numberOfCampaigns];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.target = _target;
        newCampaign.deadline = _deadline;
        newCampaign.state = _state;
        newCampaign.region = _region;
        newCampaign.image = _image;
        newCampaign.isCompleted = false;

        emit CampaignCreated(numberOfCampaigns, msg.sender, _target, _deadline);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function contribute(uint256 _campaignId) public payable {
        require(_campaignId < numberOfCampaigns, "Invalid campaign ID");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign deadline has passed");
        require(msg.value > 0, "Contribution must be greater than zero");

        Campaign storage campaign = campaigns[_campaignId];

        if (contributions[_campaignId][msg.sender] == 0) {
            campaign.contributors.push(msg.sender);
        }

        contributions[_campaignId][msg.sender] += msg.value;
        campaign.amountCollected += msg.value;

        emit ContributionReceived(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(
        uint256 _campaignId,
        bytes32[] calldata _proof
    ) public nonReentrant {
        require(_campaignId < numberOfCampaigns, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator == msg.sender, "Only campaign creator can withdraw funds");
        require(block.timestamp >= campaign.deadline, "Cannot withdraw before deadline");
        require(campaign.amountCollected >= campaign.target, "Target not reached");
        require(!campaign.isCompleted, "Funds already withdrawn");

        // ZKP Verification — Verify the user's identity without revealing personal data
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_proof, merkleRoot, leaf), "Invalid ZKP proof");

        uint256 amount = campaign.amountCollected;
        campaign.isCompleted = true;
        campaign.amountCollected = 0;

        (bool sent, ) = payable(campaign.creator).call{value: amount}("");
        require(sent, "Withdrawal failed");

        emit FundsWithdrawn(_campaignId, amount);
    }

    function getAllCampaigns() public view returns (CampaignInfo[] memory) {
        CampaignInfo[] memory allCampaigns = new CampaignInfo[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            allCampaigns[i] = CampaignInfo(
                campaign.creator,
                campaign.title,
                campaign.description,
                campaign.target,
                campaign.deadline,
                campaign.amountCollected,
                campaign.state,
                campaign.region,
                campaign.image,
                campaign.isCompleted,
                campaign.contributors
            );
        }
        return allCampaigns;
    }

    function getContribution(uint256 _campaignId, address _contributor) public view returns (uint256) {
        require(_campaignId < numberOfCampaigns, "Invalid campaign ID");
        return contributions[_campaignId][_contributor];
    }

    // ZKP Root Management for Proof Validation
    function setMerkleRoot(bytes32 _merkleRoot) external {
        merkleRoot = _merkleRoot;
    }

    receive() external payable {}
}