//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VinciNFT is ERC1155 {
    uint256 public claimed;

    constructor() ERC1155("https://ipfs.io/ipfs/bafybeibenq3eelzreoq4i7mvjlwmbiojt2hyzp6eytlzpyj5ntpethpu54/{id}.json") {
    }
    
    function claim() public {
    	_mint(msg.sender, 1, 1, "");
	claimed += 1;
    }

    function canClaim() public view returns (bool) {
    	return true;
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/bafybeibenq3eelzreoq4i7mvjlwmbiojt2hyzp6eytlzpyj5ntpethpu54/",
                Strings.toString(_tokenid),".json"
            )
        );
    }
}