//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC4626.sol"; 

contract TokenVault is ERC4626 {
    mapping(address => uint256) public shareHolder;

    constructor(IERC20 _asset) ERC4626(_asset) {}

    // このVaultにERC20を預けるメソッド
    function _deposit(uint _assets) public {
        // checks that the deposited amount is greater than zero.
        require(_assets > 0, "Deposit less than Zero");
        // ERC-4626のdepositメソッドを実行する
        deposit(_assets, msg.sender);
        // Increase the share of the user
        shareHolder[msg.sender] += _assets;
    }

    // 保有しているshareの量を返すgetter
    // ERC-4626のasset()メソッドはVaultが預かるERC20トークンのアドレスを取得
    function totalAssets() public view override returns (uint256) {
        // ERC20のトークンとしてbalanceOfを実行する必要があるので型キャスト
        return IERC20(asset()).balanceOf(address(this));
    }

    // 預けたERC20と獲得したイールドを回収するメソッド
    function _withdraw(uint _shares, address _receiver) public {
        require(_shares > 0, "withdraw must be greater than Zero");
        require(_receiver != address(0), "Zero Address");
        // 実行者はshareの所有者である必要がある
        require(shareHolder[msg.sender] > 0, "Not a shareHolder");
        require(shareHolder[msg.sender] >= _shares, "Not enough shares");

        // テスト用なので、イールドは固定で10%つける（実際は運用益に応じてイールド計算する）
        uint256 percent = (10 * _shares) / 100;
        // shareとイールドの合計を取得
        uint256 assets = _shares + percent;
        // calling the redeem function from the ERC-4626 library to perform all the necessary functionality
        redeem(assets, _receiver, msg.sender);
    }
}