const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const sirsean = "0x560EBafD8dB62cbdB44B50539d65b48072b98277";

describe("Flappers", function () {
    async function deployContract() {
        const [owner] = await ethers.getSigners();
        const cost = ethers.parseEther("0.01");
        const rlBTRFLY = "0x742B70151cd3Bc7ab598aAFF1d54B90c3ebC6027";
        const levels = [1, 10, 100, 1000];
        const Flappers = await ethers.getContractFactory("Flappers");
        const flappers = await Flappers.deploy(owner.address, rlBTRFLY, cost, levels);
        return { owner, flappers };
    }

    describe("ownership", () => {
        it("should be owned by the contract", async () => {
            const { owner, flappers } = await loadFixture(deployContract);
            expect(await flappers.owner()).to.equal(owner.address);
        });
    });

    describe("mint cost", () => {
        it("should be 0.01 ETH", async () => {
            const { flappers } = await loadFixture(deployContract);
            expect(await flappers.mintCost()).to.equal(ethers.parseEther("0.01"));
        });

        it("should be able to set the mint cost", async () => {
            const { flappers } = await loadFixture(deployContract);
            const cost = ethers.parseEther("0.02");
            await flappers.setMintCost(cost);
            expect(await flappers.mintCost()).to.equal(cost);
        });
    });

    describe("levels", () => {
        it("should have 4 levels", async () => {
            const { flappers } = await loadFixture(deployContract);
            expect(await flappers.getLevels()).to.deep.equal([1, 10, 100, 1000]);
        });

        it("should be able to add levels", async () => {
            const { flappers } = await loadFixture(deployContract);
            expect(await flappers.validLevels(5)).to.equal(false);
            await flappers.addLevel(5);
            expect(await flappers.getLevels()).to.deep.equal([1, 10, 100, 1000, 5]);
            expect(await flappers.validLevels(5)).to.equal(true);
        })
    });

    describe("canMint", () => {
        it("should be able to mint", async () => {
            const { owner, flappers } = await loadFixture(deployContract);
            expect(await flappers.addrCanMint(sirsean, 1)).to.equal(true);
        });

        it("no rlBTRFLY should not be able to mint", async () => {
            const { flappers } = await loadFixture(deployContract);
            expect(await flappers.canMint(1)).to.equal(false);
        });

        it("cannot mint an invalid level", async () => {
            const { flappers } = await loadFixture(deployContract);
            const signer = await ethers.getImpersonatedSigner(sirsean);
            expect(await flappers.connect(signer).canMint(0)).to.equal(false);
            expect(await flappers.connect(signer).canMint(5)).to.equal(false);
        });
    });

    describe("mint", () => {
        it("should be able to mint", async () => {
            const { owner, flappers } = await loadFixture(deployContract);
            const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
            const signer = await ethers.getImpersonatedSigner(sirsean);
            const signerBalanceBefore = await ethers.provider.getBalance(sirsean);
            expect(await flappers.balanceOf(signer.address, 1)).to.equal(0);
            await flappers.connect(signer).mint(1, { value: ethers.parseEther("0.01") });
            // the caller should have this NFT now
            expect(await flappers.balanceOf(signer.address, 1)).to.equal(1);
            // the owner got paid
            expect(await ethers.provider.getBalance(owner.address)).to.equal(ownerBalanceBefore + ethers.parseEther("0.01"));
            // the signer paid the mint cost, plus some gas
            expect(await ethers.provider.getBalance(sirsean).then(b => b + ethers.parseEther("0.01"))).to.be.lessThanOrEqual(signerBalanceBefore);
            // can no longer mint this level
            expect(await flappers.connect(signer).canMint(1)).to.equal(false);
        });
    });
});