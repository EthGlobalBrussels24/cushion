// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Vault } from "./vault.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultFactory is Ownable {
  address[] public vaults;
  address[] public tokens;
  mapping(address => address) public tokenToVault;

  event VaultCreated(address vaultAddress);

  constructor(address initialOwner) Ownable(initialOwner) {}

  function createVault(
    address tokenAddress,
    string memory name,
    string memory symbol
  ) external onlyOwner returns (address) {
    IERC20 _token = IERC20(tokenAddress);
    Vault newVault = new Vault(_token, name, symbol);
    vaults.push(address(newVault));
    tokens.push(tokenAddress);
    tokenToVault[tokenAddress] = address(newVault);
    emit VaultCreated(address(newVault));
    return address(newVault);
  }

  function getVaults() external view returns (address[] memory) {
    return vaults;
  }
}
