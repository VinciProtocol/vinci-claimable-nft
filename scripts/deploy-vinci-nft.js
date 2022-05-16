// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const VinciNFT = await hre.ethers.getContractFactory("VinciNFT");
  const vincinft = await VinciNFT.deploy("0x48de10fd865287a0cc654e85a0290008107d0811e55ffd5f808cb8da3dc32fab", 
    "https://ipfs.io/ipfs/bafybeigp3r2bqvsxwwwopov4bf6l3xdsvrul3sctmzrejbzugya7kxzfye/");

  await vincinft.deployed();

  console.log("VinciNFT deployed to:", vincinft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
