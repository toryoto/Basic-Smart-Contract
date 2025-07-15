const { expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");
const { ethers } = require("hardhat");

describe("TokenVault", function () {
  let owner, user1, user2, erc20, TokenVault, vault;

  // すべてのテストケースの前に実行する処理
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
  
    Stablecoin = await ethers.getContractFactory("Stablecoin");
    const initialSupply = ethers.parseEther("2000");
    erc20 = await Stablecoin.deploy("TestToken", "TTK", initialSupply, 18);
    await erc20.waitForDeployment();
  
    // user1にトークンを配布
    await erc20.mint(user1.address, ethers.parseEther("1000"));
  
    // TokenVaultをデプロイ
    TokenVault = await ethers.getContractFactory("TokenVault");
    vault = await TokenVault.deploy(erc20.target);
    await vault.waitForDeployment();
  });

  describe("_deposit", function () {
    it("should deposit tokens and update balanceOf", async function () {
      const amount = ethers.parseEther("100");
      await erc20.approve(vault.target, amount);
      await vault._deposit(amount);

      expect((await vault.balanceOf(owner.address)).toString()).to.equal(amount.toString());
      expect((await vault.totalAssets()).toString()).to.equal(amount.toString());
    });

    it("should revert if deposit amount is zero", async function () {
      await expect(vault._deposit(0)).to.be.revertedWith("Deposit less than Zero");
    });
  });

  describe("_withdraw", function () {
    it("should withdraw tokens and yield", async function () {
      const depositAmount = ethers.parseEther("100");
      await erc20.approve(vault.target, depositAmount);
      await vault._deposit(depositAmount);

      const withdrawAmount = ethers.parseEther("50");
      // previewRedeemで本来の払い出し資産を計算
      const baseAssets = await vault.previewRedeem(withdrawAmount);
      const bonus = baseAssets / 10n;
      const totalAssetsPaid = baseAssets + bonus;

      // 残高を記録
      const beforeVaultAssets = await vault.totalAssets();
      const beforeUserShares = await vault.balanceOf(owner.address);

      await vault._withdraw(withdrawAmount, owner.address);

      // シェア残高はwithdrawAmountだけ減る
      expect((await vault.balanceOf(owner.address)).toString()).to.equal((depositAmount - withdrawAmount).toString());
      // Vaultの残高は10%増しで減る
      expect((await vault.totalAssets()).toString()).to.equal((beforeVaultAssets - totalAssetsPaid).toString());
    });

    it("should revert if withdraw amount is zero", async function () {
      await expect(vault._withdraw(0, owner.address)).to.be.revertedWith("withdraw must be greater than Zero");
    });

    it("should revert if receiver is zero address", async function () {
      await expect(vault._withdraw(1, ethers.ZeroAddress)).to.be.revertedWith("Zero Address");
    });

    it("should revert if not a shareHolder", async function () {
      await expect(vault.connect(user1)._withdraw(1, user1.address)).to.be.revertedWith("Not a shareHolder");
    });

    it("should revert if not enough shares", async function () {
      const amount = ethers.parseEther("10");
      await erc20.approve(vault.target, amount);
      await vault._deposit(amount);

      await expect(vault._withdraw(amount + 1n, owner.address)).to.be.revertedWith("Not enough shares");
    });
  });

  describe("totalAssets", function () {
    it("should return the correct total assets", async function () {
      const amount = ethers.parseEther("100");
      await erc20.approve(vault.target, amount);
      await vault._deposit(amount);

      expect((await vault.totalAssets()).toString()).to.equal(amount.toString());
    });
  });
});