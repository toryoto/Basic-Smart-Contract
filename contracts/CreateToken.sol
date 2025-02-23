// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreateToken is ERC20, ERC20Burnable, Ownable {
    event TokensMinted(address indexed to, uint256 amount);

    constructor(string memory name_, string memory symbol_, uint256 initialSupply) 
        ERC20(name_, symbol_)
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 1e18);
    }

    // トークンの追加発行を可能にする
    // 一般的な目的：インフレーション型のトークノミクス実装
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be positive");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}