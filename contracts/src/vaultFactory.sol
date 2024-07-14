// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Vault } from "./Vault.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { MockERC20 } from "./MockERC20.sol";

import { IHooks } from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { CurrencyLibrary, Currency } from "@uniswap/v4-core/src/types/Currency.sol";

contract VaultFactory is Ownable {
  using CurrencyLibrary for Currency;

  IPoolManager public immutable poolManager;
  address public immutable wrappedNative;

  address public hook;

  address[] public vaults;
  address[] public tokens;
  mapping(address => address) public tokenToVault;

  event VaultCreated(address vaultAddress);

  constructor(address initialOwner, IPoolManager uniPoolManager, address wNative) Ownable(initialOwner) {
    poolManager = uniPoolManager;
    wrappedNative = wNative;
  }

  function setHook(address newHook) external onlyOwner {
    require(hook == address(0), "Hook already set");
    hook = newHook;
  }

  function createInsuredPool(address token0, address token1) external {
    _initializeUniPool(token0, token1, address(0), 79228162514264337593543950336, bytes(""));
  }

  function launchCushionToken(
    string memory name,
    string memory symbol,
    uint256 totalSupply,
    uint160 initialPrice
  ) external returns (address token, address vault) {
    token = address(new MockERC20(name, symbol, totalSupply));
    vault = address(new Vault(MockERC20(token)));

    tokens.push(token);
    vaults.push(vault);
    tokenToVault[token] = vault;

    _initializeUniPool(token, wrappedNative, hook, initialPrice, abi.encode(vault));
  }

  function increaseCushionRiskFactor(address vault, uint256 amountInsured, uint256 amountWNative) external {
    // Vault(vault).increaseCushionRiskFactor(poolId, cushionRiskFactor);
  }

  function decreaseCushionRiskFactor(address vault, uint256 amountInsured, uint256 amountWNative) external {
    // Vault(vault).burn(from, amount);
  }

  function getVaults() external view returns (address[] memory) {
    return vaults;
  }

  function getTokens() external view returns (address[] memory) {
    return tokens;
  }

  function _initializeUniPool(
    address token0,
    address token1,
    address hook,
    uint160 sqrtPriceX96,
    bytes memory hookData
  ) internal {
    if (token0 > token1) {
      (token0, token1) = (token1, token0);
    }

    PoolKey memory pool = PoolKey({
      currency0: Currency.wrap(token0),
      currency1: Currency.wrap(token1),
      fee: 500, // 0.05%
      tickSpacing: 10,
      hooks: IHooks(hook)
    });
    poolManager.initialize(pool, sqrtPriceX96, hookData);
  }
}
