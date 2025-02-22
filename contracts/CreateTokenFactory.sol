// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./CreateToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreateTokenFactory {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 initialSupply;
        uint256 timestamp;
    }

    // ユーザーごとのトークン配列
    mapping(address => TokenInfo[]) public userTokens;
    
    event TokenCreated(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 timestamp
    );

    function createToken(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) public returns (address) {
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(symbol_).length > 0, "Symbol cannot be empty");
        require(initialSupply_ > 0, "Supply must be positive");

        // 新しいトークンコントラクトの作成
        CreateToken newToken = new CreateToken(
            name_,
            symbol_,
            initialSupply_
        );

        // トークン情報の保存
        TokenInfo memory tokenInfo = TokenInfo({
            tokenAddress: address(newToken),
            name: name_,
            symbol: symbol_,
            initialSupply: initialSupply_,
            timestamp: block.timestamp
        });

        newToken.transfer(msg.sender, initialSupply_ * 1e18);
        newToken.transferOwnership(msg.sender);
        userTokens[msg.sender].push(tokenInfo);

        emit TokenCreated(
            msg.sender,
            address(newToken),
            name_,
            symbol_,
            initialSupply_,
            block.timestamp
        );

        return address(newToken);
    }

    function getUserTokens(address user) public view returns (TokenInfo[] memory) {
        return userTokens[user];
    }

    function getUserLatestToken(address user) public view returns (TokenInfo memory) {
        require(userTokens[user].length > 0, "No tokens created");
        return userTokens[user][userTokens[user].length - 1];
    }

    function getUserTokenCount(address user) public view returns (uint256) {
        return userTokens[user].length;
    }
}