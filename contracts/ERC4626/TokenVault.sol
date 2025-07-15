//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenVault is ERC4626, Ownable {
    constructor(IERC20 _asset) ERC4626(_asset) Ownable(msg.sender) {}

    // このVaultにERC20を預けるメソッド
    function _deposit(uint _assets) public {
        require(_assets > 0, "Deposit less than Zero");
        deposit(_assets, msg.sender);
    }

    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }

    // デモ用：管理者による資産補充関数
    function replenish(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        IERC20(asset()).transferFrom(msg.sender, address(this), amount);
    }

    // 預けたERC20と獲得したイールドを回収するメソッド
    function _withdraw(uint _shares, address _receiver) public {
        require(_shares > 0, "withdraw must be greater than Zero");
        require(_receiver != address(0), "Zero Address");
        require(balanceOf(msg.sender) > 0, "Not a shareHolder");
        require(balanceOf(msg.sender) >= _shares, "Not enough shares");

        // 通常のredeemで計算されるasset
        uint256 baseAssets = previewRedeem(_shares); // _shares分の資産
        uint256 bonus = baseAssets / 10;             // 10%ボーナス
        uint256 totalAssets = baseAssets + bonus;    // 合計払い出し資産

        // シェアをバーン
        _burn(msg.sender, _shares);

        // 10%増しで資産を払い出す
        IERC20(asset()).transfer(_receiver, totalAssets);
    }
}