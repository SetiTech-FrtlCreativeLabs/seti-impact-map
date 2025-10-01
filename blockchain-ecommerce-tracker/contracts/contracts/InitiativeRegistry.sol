// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title InitiativeRegistry
 * @dev ERC721 contract for tracking blockchain-linked initiative tokens
 * @notice This contract mints unique tokens for each product purchase linked to initiatives
 */
contract InitiativeRegistry is ERC721, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Struct to store token metadata
    struct TokenData {
        string purchaseId;
        string initiativeId;
        string customerEmail;
        uint256 mintedAt;
        bool isActive;
    }
    
    // Mapping from token ID to token data
    mapping(uint256 => TokenData) public tokenData;
    
    // Mapping from purchase ID to token ID (to prevent duplicates)
    mapping(string => uint256) public purchaseToToken;
    
    // Mapping from initiative ID to array of token IDs
    mapping(string => uint256[]) public initiativeTokens;
    
    // Events
    event TokenMinted(
        uint256 indexed tokenId,
        string indexed purchaseId,
        string indexed initiativeId,
        string customerEmail
    );
    
    event TokenDeactivated(uint256 indexed tokenId);
    
    constructor() ERC721("InitiativeTracker", "INIT") {}
    
    /**
     * @dev Mint a new token for a purchase linked to an initiative
     * @param to The address to mint the token to
     * @param purchaseId The unique purchase identifier
     * @param initiativeId The initiative this purchase supports
     * @param customerEmail The customer's email address
     */
    function mintToken(
        address to,
        string memory purchaseId,
        string memory initiativeId,
        string memory customerEmail
    ) external onlyOwner whenNotPaused {
        require(bytes(purchaseId).length > 0, "Purchase ID cannot be empty");
        require(bytes(initiativeId).length > 0, "Initiative ID cannot be empty");
        require(bytes(customerEmail).length > 0, "Customer email cannot be empty");
        require(purchaseToToken[purchaseId] == 0, "Purchase already has a token");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Store token data
        tokenData[tokenId] = TokenData({
            purchaseId: purchaseId,
            initiativeId: initiativeId,
            customerEmail: customerEmail,
            mintedAt: block.timestamp,
            isActive: true
        });
        
        // Map purchase to token
        purchaseToToken[purchaseId] = tokenId;
        
        // Add token to initiative
        initiativeTokens[initiativeId].push(tokenId);
        
        // Mint the token
        _safeMint(to, tokenId);
        
        emit TokenMinted(tokenId, purchaseId, initiativeId, customerEmail);
    }
    
    /**
     * @dev Get token data by token ID
     * @param tokenId The token ID to query
     * @return TokenData struct containing all token information
     */
    function getTokenData(uint256 tokenId) external view returns (TokenData memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenData[tokenId];
    }
    
    /**
     * @dev Get all tokens for a specific initiative
     * @param initiativeId The initiative ID to query
     * @return Array of token IDs for the initiative
     */
    function getInitiativeTokens(string memory initiativeId) external view returns (uint256[] memory) {
        return initiativeTokens[initiativeId];
    }
    
    /**
     * @dev Get token ID by purchase ID
     * @param purchaseId The purchase ID to query
     * @return The token ID for the purchase, or 0 if not found
     */
    function getTokenByPurchase(string memory purchaseId) external view returns (uint256) {
        return purchaseToToken[purchaseId];
    }
    
    /**
     * @dev Deactivate a token (soft delete)
     * @param tokenId The token ID to deactivate
     */
    function deactivateToken(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(tokenData[tokenId].isActive, "Token already deactivated");
        
        tokenData[tokenId].isActive = false;
        emit TokenDeactivated(tokenId);
    }
    
    /**
     * @dev Get total number of tokens minted
     * @return The total number of tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override tokenURI to return metadata
     * @param tokenId The token ID
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        TokenData memory data = tokenData[tokenId];
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _encodeMetadata(data)
        ));
    }
    
    /**
     * @dev Encode token metadata as base64 JSON
     * @param data The token data
     * @return Base64 encoded JSON metadata
     */
    function _encodeMetadata(TokenData memory data) internal pure returns (string memory) {
        string memory json = string(abi.encodePacked(
            '{"name":"Initiative Tracker Token #',
            _toString(data.mintedAt),
            '","description":"A blockchain token representing a purchase linked to an initiative.","attributes":[',
            '{"trait_type":"Purchase ID","value":"',
            data.purchaseId,
            '"},{"trait_type":"Initiative ID","value":"',
            data.initiativeId,
            '"},{"trait_type":"Customer Email","value":"',
            data.customerEmail,
            '"},{"trait_type":"Minted At","value":',
            _toString(data.mintedAt),
            '},{"trait_type":"Active","value":',
            data.isActive ? 'true' : 'false',
            '}]}'
        ));
        
        return _base64Encode(bytes(json));
    }
    
    /**
     * @dev Convert uint256 to string
     * @param value The uint256 value
     * @return String representation
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    /**
     * @dev Base64 encode bytes
     * @param data The bytes to encode
     * @return Base64 encoded string
     */
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen);
        
        assembly {
            let tablePtr := add(table, 1)
            let result := add(result, 0x20)
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            
            for {} lt(dataPtr, endPtr) {}
            {
                dataPtr := add(dataPtr, 0x3)
                let input := mload(dataPtr)
                
                let output := add(result, 0x20)
                mstore(output, shl(248, mload(add(tablePtr, shr(250, input)))))
                mstore(add(output, 1), shl(248, mload(add(tablePtr, shr(244, input)))))
                mstore(add(output, 2), shl(248, mload(add(tablePtr, shr(238, input)))))
                mstore(add(output, 3), shl(248, mload(add(tablePtr, shr(232, input)))))
                
                result := add(result, 4)
            }
            
            switch mod(mload(data), 3)
            case 1 { mstore(sub(result, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(result, 1), shl(248, 0x3d)) }
        }
        
        return result;
    }
}
