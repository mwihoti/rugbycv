// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract RugbyCVProfile is ERC721, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct Profile {
        string name;
        string position;
        uint256 height;         // in cm
        uint256 weight;         // in kg
        string secondJob;
        string injuryStatus;
        bool availableForTransfer;
        string videoHash;       // IPFS CID (e.g. "Qm...")
    }

    struct Badge {
        string badgeType;
        address issuer;
        uint256 timestamp;
    }

    mapping(uint256 => Profile) public profiles;
    mapping(uint256 => Badge[]) public badges;
    mapping(address => bool) public verifiedIssuers;

    uint256 private _nextTokenId = 1;

    event ProfileCreated(uint256 indexed tokenId, address indexed owner);
    event BadgeMinted(uint256 indexed tokenId, string badgeType, address issuer);
    event TransferAvailabilityToggled(uint256 indexed tokenId, bool available);

    constructor() ERC721("RugbyCV", "RCV") Ownable(msg.sender) {}

    function addIssuer(address issuer) external onlyOwner {
        verifiedIssuers[issuer] = true;
    }

    function createProfile(
        string memory name,
        string memory position,
        uint256 height,
        uint256 weight,
        string memory secondJob,
        string memory injuryStatus,
        bool availableForTransfer,
        string memory videoHash
    ) external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        profiles[tokenId] = Profile({
            name: name,
            position: position,
            height: height,
            weight: weight,
            secondJob: secondJob,
            injuryStatus: injuryStatus,
            availableForTransfer: availableForTransfer,
            videoHash: videoHash
        });

        emit ProfileCreated(tokenId, msg.sender);
    }

    function toggleTransferAvailability(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        profiles[tokenId].availableForTransfer = !profiles[tokenId].availableForTransfer;
        emit TransferAvailabilityToggled(tokenId, profiles[tokenId].availableForTransfer);
    }

    // Fully fixed mintBadge – no Unicode, compiles everywhere
    function mintBadge(
        uint256 tokenId,
        string memory badgeType,
        bytes memory signature
    ) external {
        require(verifiedIssuers[msg.sender], "Only verified issuer");
        require(ownerOf(tokenId) != address(0), "Profile does not exist");

        // EIP-191 compliant signing (Metamask & most wallets do this automatically)
        bytes32 messageHash = keccak256(abi.encodePacked(tokenId, badgeType));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        address signer = ethSignedMessageHash.recover(signature);
        require(signer == ownerOf(tokenId), "Signature must come from profile owner");

        badges[tokenId].push(Badge({
            badgeType: badgeType,
            issuer: msg.sender,
            timestamp: block.timestamp
        }));

        emit BadgeMinted(tokenId, badgeType, msg.sender);
    }

    // View function – returns everything a frontend needs
    function getProfile(uint256 tokenId)
        external
        view
        returns (Profile memory profile, Badge[] memory badgeList)
    {
        profile = profiles[tokenId];
        badgeList = badges[tokenId];
    }
}