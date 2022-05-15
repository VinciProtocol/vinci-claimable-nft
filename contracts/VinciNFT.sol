//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VinciNFT is ERC1155, Ownable {
    bytes32 public merkleRoot;
    string public baseURI;
    mapping(address=>bool) public claimed;

    constructor(bytes32 _merkleRoot, string memory _baseURI) ERC1155(_baseURI) {
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
    }

    function setParams(string memory newBaseURI, bytes32 newMerkleRoot) external onlyOwner {
        merkleRoot = newMerkleRoot;
        baseURI = newBaseURI;
    }
    
    function mint(bytes32[] calldata _merkleProof, uint256 amount) public {
        require(claimed[msg.sender] == false, "already claimed");
        claimed[msg.sender] = true;
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf) == true, "wrong merkle proof");
        _mint(msg.sender, 1, 1, "");
    }

    function hasClaimed() public view returns (bool) {
        return claimed[msg.sender];
    }

    function tokenURI(uint256 id) public view returns (string memory) {
        return string(abi.encodePacked(baseURI, Strings.toString(id), ".json"));
    }

    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(baseURI, "1.json"));
    }
}