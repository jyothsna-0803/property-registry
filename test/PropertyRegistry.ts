import { expect } from "chai";
import { network } from "hardhat";

describe("PropertyRegistry", function () {
  async function deployPropertyRegistry() {
    const { ethers } = await network.connect();

    const [owner, newOwner, otherUser] = await ethers.getSigners();

    const propertyRegistry = await ethers.deployContract(
      "PropertyRegistry"
    );

    return {
      propertyRegistry,
      owner,
      newOwner,
      otherUser,
    };
  }

  describe("Property Registration", function () {
    it("should register a property", async function () {
      const {
        propertyRegistry,
        owner,
      } = await deployPropertyRegistry();

      await propertyRegistry.registerProperty(
        "12 MG Road, Bengaluru",
        5000000
      );

      const property = await propertyRegistry.getProperty(0);

      expect(property[0]).to.equal(
        "12 MG Road, Bengaluru"
      );

      expect(property[1]).to.equal(owner.address);

      expect(property[2]).to.equal(5000000);
    });
  });

  describe("Ownership Transfer", function () {
    it("should transfer ownership", async function () {
      const {
        propertyRegistry,
        owner,
        newOwner,
      } = await deployPropertyRegistry();

      await propertyRegistry.registerProperty(
        "12 MG Road, Bengaluru",
        5000000
      );

      await propertyRegistry.transferOwnership(
        0,
        newOwner.address
      );

      const property = await propertyRegistry.getProperty(0);

      expect(property[1]).to.equal(newOwner.address);
    });

    it("should prevent a non-owner from transferring ownership", async function () {
      const {
        propertyRegistry,
        owner,
        otherUser,
        newOwner,
      } = await deployPropertyRegistry();

      await propertyRegistry.registerProperty(
        "12 MG Road, Bengaluru",
        5000000
      );

      const unauthorizedRegistry =
        propertyRegistry.connect(otherUser);

      await expect(
        unauthorizedRegistry.transferOwnership(
          0,
          newOwner.address
        )
      ).to.be.revertedWith(
        "Only the owner can transfer ownership"
      );

      const property = await propertyRegistry.getProperty(0);

      expect(property[1]).to.equal(owner.address);
    });
  });
});