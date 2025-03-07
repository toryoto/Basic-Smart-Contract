// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreateToken2 is ERC20, ERC20Burnable, Ownable {
    event TokensMinted(address indexed to, uint256 amount);
    
    uint8 private _decimals;

    constructor(
        string memory name_, 
        string memory symbol_, 
        uint256 initialSupply,
        uint8 decimals_
    ) 
        ERC20(name_, symbol_)
        Ownable(msg.sender)
    {
        _decimals = decimals_;
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // トークンの追加発行を可能にする
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be positive");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}