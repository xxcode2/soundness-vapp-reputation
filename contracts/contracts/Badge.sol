// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title SoundnessBadge
/// @notice Minimal ERC721 "reputation badge" gated by an attestation hash produced off-chain.
/// The off-chain API must verify the Soundness proof and then call mintWithAttestation.
contract SoundnessBadge is ERC721, Ownable {
    using ECDSA for bytes32;

    uint256 public nextId = 1;

    // Prevents replaying the same attestation hash.
    mapping(bytes32 => bool) public usedAttestation;

    // Optional: simple type code for different badge categories.
    mapping(uint256 => uint8) public badgeType;

    event Minted(address indexed to, uint256 indexed tokenId, bytes32 attHash, uint8 t);

    constructor() ERC721("Soundness Badge", "SNDB") Ownable(msg.sender) {}

    /// @dev Mint after off-chain verification. The attestationHash must be unique.
    /// @param to recipient address
    /// @param attestationHash keccak256 of canonical attestation bytes (off-chain computed)
    /// @param t badge type (0 = generic; app-specific)
    function mintWithAttestation(address to, bytes32 attestationHash, uint8 t) external onlyOwner {
        require(!usedAttestation[attestationHash], "Attestation already used");
        usedAttestation[attestationHash] = true;
        uint256 tokenId = nextId++;
        _safeMint(to, tokenId);
        badgeType[tokenId] = t;
        emit Minted(to, tokenId, attestationHash, t);
    }
}
