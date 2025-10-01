const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InitiativeRegistry", function () {
  let initiativeRegistry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const InitiativeRegistry = await ethers.getContractFactory("InitiativeRegistry");
    initiativeRegistry = await InitiativeRegistry.deploy();
    await initiativeRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await initiativeRegistry.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await initiativeRegistry.name()).to.equal("InitiativeTracker");
      expect(await initiativeRegistry.symbol()).to.equal("INIT");
    });

    it("Should start with total supply of 0", async function () {
      expect(await initiativeRegistry.totalSupply()).to.equal(0);
    });
  });

  describe("Token Minting", function () {
    it("Should mint a token successfully", async function () {
      const purchaseId = "purchase_123";
      const initiativeId = "initiative_456";
      const customerEmail = "customer@example.com";

      await expect(
        initiativeRegistry.mintToken(
          addr1.address,
          purchaseId,
          initiativeId,
          customerEmail
        )
      )
        .to.emit(initiativeRegistry, "TokenMinted")
        .withArgs(1, purchaseId, initiativeId, customerEmail);

      expect(await initiativeRegistry.balanceOf(addr1.address)).to.equal(1);
      expect(await initiativeRegistry.totalSupply()).to.equal(1);
      expect(await initiativeRegistry.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should not allow minting with empty purchase ID", async function () {
      await expect(
        initiativeRegistry.mintToken(
          addr1.address,
          "",
          "initiative_456",
          "customer@example.com"
        )
      ).to.be.revertedWith("Purchase ID cannot be empty");
    });

    it("Should not allow minting with empty initiative ID", async function () {
      await expect(
        initiativeRegistry.mintToken(
          addr1.address,
          "purchase_123",
          "",
          "customer@example.com"
        )
      ).to.be.revertedWith("Initiative ID cannot be empty");
    });

    it("Should not allow minting with empty customer email", async function () {
      await expect(
        initiativeRegistry.mintToken(
          addr1.address,
          "purchase_123",
          "initiative_456",
          ""
        )
      ).to.be.revertedWith("Customer email cannot be empty");
    });

    it("Should not allow minting duplicate purchase ID", async function () {
      const purchaseId = "purchase_123";
      const initiativeId = "initiative_456";
      const customerEmail = "customer@example.com";

      await initiativeRegistry.mintToken(
        addr1.address,
        purchaseId,
        initiativeId,
        customerEmail
      );

      await expect(
        initiativeRegistry.mintToken(
          addr2.address,
          purchaseId,
          "initiative_789",
          "customer2@example.com"
        )
      ).to.be.revertedWith("Purchase already has a token");
    });

    it("Should only allow owner to mint tokens", async function () {
      await expect(
        initiativeRegistry.connect(addr1).mintToken(
          addr1.address,
          "purchase_123",
          "initiative_456",
          "customer@example.com"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token Data", function () {
    beforeEach(async function () {
      await initiativeRegistry.mintToken(
        addr1.address,
        "purchase_123",
        "initiative_456",
        "customer@example.com"
      );
    });

    it("Should return correct token data", async function () {
      const tokenData = await initiativeRegistry.getTokenData(1);
      
      expect(tokenData.purchaseId).to.equal("purchase_123");
      expect(tokenData.initiativeId).to.equal("initiative_456");
      expect(tokenData.customerEmail).to.equal("customer@example.com");
      expect(tokenData.isActive).to.be.true;
      expect(tokenData.mintedAt).to.be.greaterThan(0);
    });

    it("Should return correct token by purchase ID", async function () {
      const tokenId = await initiativeRegistry.getTokenByPurchase("purchase_123");
      expect(tokenId).to.equal(1);
    });

    it("Should return 0 for non-existent purchase ID", async function () {
      const tokenId = await initiativeRegistry.getTokenByPurchase("non_existent");
      expect(tokenId).to.equal(0);
    });

    it("Should return initiative tokens", async function () {
      const tokens = await initiativeRegistry.getInitiativeTokens("initiative_456");
      expect(tokens.length).to.equal(1);
      expect(tokens[0]).to.equal(1);
    });
  });

  describe("Token Deactivation", function () {
    beforeEach(async function () {
      await initiativeRegistry.mintToken(
        addr1.address,
        "purchase_123",
        "initiative_456",
        "customer@example.com"
      );
    });

    it("Should deactivate token successfully", async function () {
      await expect(initiativeRegistry.deactivateToken(1))
        .to.emit(initiativeRegistry, "TokenDeactivated")
        .withArgs(1);

      const tokenData = await initiativeRegistry.getTokenData(1);
      expect(tokenData.isActive).to.be.false;
    });

    it("Should not allow deactivating non-existent token", async function () {
      await expect(initiativeRegistry.deactivateToken(999))
        .to.be.revertedWith("Token does not exist");
    });

    it("Should not allow deactivating already deactivated token", async function () {
      await initiativeRegistry.deactivateToken(1);
      
      await expect(initiativeRegistry.deactivateToken(1))
        .to.be.revertedWith("Token already deactivated");
    });

    it("Should only allow owner to deactivate tokens", async function () {
      await expect(
        initiativeRegistry.connect(addr1).deactivateToken(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause contract", async function () {
      await initiativeRegistry.pause();
      expect(await initiativeRegistry.paused()).to.be.true;

      await initiativeRegistry.unpause();
      expect(await initiativeRegistry.paused()).to.be.false;
    });

    it("Should not allow minting when paused", async function () {
      await initiativeRegistry.pause();

      await expect(
        initiativeRegistry.mintToken(
          addr1.address,
          "purchase_123",
          "initiative_456",
          "customer@example.com"
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should only allow owner to pause/unpause", async function () {
      await expect(
        initiativeRegistry.connect(addr1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        initiativeRegistry.connect(addr1).unpause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token URI", function () {
    beforeEach(async function () {
      await initiativeRegistry.mintToken(
        addr1.address,
        "purchase_123",
        "initiative_456",
        "customer@example.com"
      );
    });

    it("Should return valid token URI", async function () {
      const tokenURI = await initiativeRegistry.tokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
    });

    it("Should not return URI for non-existent token", async function () {
      await expect(initiativeRegistry.tokenURI(999))
        .to.be.revertedWith("Token does not exist");
    });
  });
});
