const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = require("keccak256");
const config = require("./config.json");

function generateLeaf(address, value) {
  return Buffer.from(
    // Hash in appropriate Merkle format
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [address, value])
      .slice(2),
    "hex"
  );
}

const merkleTree = new MerkleTree(
  // Generate leafs
  Object.entries(config.airdrop).map(([address, tokens]) =>
    generateLeaf(
      ethers.utils.getAddress(address),
      ethers.utils.parseUnits(tokens.toString(), config.decimals).toString()
    )
  ),
  // Hashing function
  keccak256,
  { sortPairs: true }
  // { sortPairs: true, sortLeaves: true }
);

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("VinciNFT", function () {
  it("Should test Merkle Root", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    console.log(owner.address);

    const formattedOwner = ethers.utils.getAddress(owner.address);
    const numTokens = ethers.utils.parseUnits(config.airdrop[formattedOwner].toString(), config.decimals).toString();

    // Generate hashed leaf from address
    const leaf = generateLeaf(formattedOwner, numTokens);
    // Generate airdrop proof
    const proof = merkleTree.getHexProof(leaf);
    // console.log("Merkle Root", merkleTree.getHexRoot());

    const checkproof = merkleTree.verify(proof, leaf, merkleTree.getHexRoot());

    const VinciNFT = await ethers.getContractFactory("VinciNFT");
    // construct with Merkle Root
    const vincinft = await VinciNFT.deploy("0x73ebfa47f11a60d67b4f05be47caf6676ed901cebdfcd0046dd8864124d30c6b", 
      "https://ipfs.io/ipfs/bafybeigp3r2bqvsxwwwopov4bf6l3xdsvrul3sctmzrejbzugya7kxzfye/");
    await vincinft.deployed();

    await vincinft.mint(["0x3f68e79174daf15b50e15833babc8eb7743e730bb9606f922c48e95314c3905c", "0x320723cfc0bfa9b0f7c5b275a01ffa5e0f111f05723ba5df2b2684ab86bebe06"], 1);
    expect(await vincinft.hasClaimed()).to.equal(true);

    expect(await vincinft.tokenURI(1)).to.equal("https://ipfs.io/ipfs/bafybeigp3r2bqvsxwwwopov4bf6l3xdsvrul3sctmzrejbzugya7kxzfye/1.json");
    expect(await vincinft.contractURI()).to.equal("https://ipfs.io/ipfs/bafybeigp3r2bqvsxwwwopov4bf6l3xdsvrul3sctmzrejbzugya7kxzfye/1.json");
    // await vincinft.connect(addr1).setParams("newURI", "0x73ebfa47f11a60d67b4f05be47caf6676ed901cebdfcd0046dd8864124d30c6b");
   });
});
