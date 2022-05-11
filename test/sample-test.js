const { expect } = require("chai");
const { ethers } = require("hardhat");

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
  it("Should increase the number of claimed", async function () {
    const VinciNFT = await ethers.getContractFactory("VinciNFT");
    const vincinft = await VinciNFT.deploy()
    await vincinft.deployed()

    expect(await vincinft.claimed()).to.equal(0);
    expect(await vincinft.canClaim()).to.equal(true);

    await vincinft.claim();
    expect(await vincinft.claimed()).to.equal(1);
   });
});
