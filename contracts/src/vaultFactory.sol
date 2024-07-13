// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Vault } from "./Vault.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";

import { IHooks } from "v4-core/interfaces/IHooks.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";
import { CurrencyLibrary, Currency } from "v4-core/types/Currency.sol";

contract VaultFactory {
  using CurrencyLibrary for Currency;

  IPoolManager public immutable poolManager;

  address[] public vaults;
  address[] public tokens;
  mapping(address => address) public tokenToVault;

  event VaultCreated(address vaultAddress);

  constructor(IPoolManager uniPoolManager) {
    poolManager = uniPoolManager;
  }

  function createInsuredPool(address token0, address token1) external {
    _initializeUniPool(token0, token1, address(0), 79228162514264337593543950336, bytes(""));
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
