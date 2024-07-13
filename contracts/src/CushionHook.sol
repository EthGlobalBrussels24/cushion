// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { BaseHook } from "v4-periphery/BaseHook.sol";

import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { Hooks } from "@uniswap/v4-core/src/libraries/Hooks.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { BalanceDelta } from "@uniswap/v4-core/src/types/BalanceDelta.sol";

contract CushionHook is BaseHook {
  constructor(IPoolManager poolManager_) BaseHook(poolManager_) {}

  function afterAddLiquidity(
    address,
    PoolKey calldata,
    IPoolManager.ModifyLiquidityParams calldata,
    BalanceDelta,
    bytes calldata
  ) external override returns (bytes4, BalanceDelta) {
    revert HookNotImplemented();
  }

  function afterRemoveLiquidity(
    address,
    PoolKey calldata,
    IPoolManager.ModifyLiquidityParams calldata,
    BalanceDelta,
    bytes calldata
  ) external override returns (bytes4, BalanceDelta) {
    revert HookNotImplemented();
  }

  function afterSwap(
    address,
    PoolKey calldata,
    IPoolManager.SwapParams calldata,
    BalanceDelta,
    bytes calldata
  ) external override returns (bytes4, int128) {
    // detect zeroForOne
    // if buy
    // take fee for insurance protocol
    revert HookNotImplemented();
  }

  function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
    return
      Hooks.Permissions({
        beforeInitialize: false,
        afterInitialize: false,
        beforeAddLiquidity: false,
        beforeRemoveLiquidity: false,
        afterAddLiquidity: true, // decrease cushion risk factor
        afterRemoveLiquidity: true, // increase cushion risk factor
        beforeSwap: false,
        afterSwap: true, // take fee for insurance protocol
        beforeDonate: false,
        afterDonate: false,
        beforeSwapReturnDelta: false,
        afterSwapReturnDelta: false,
        afterAddLiquidityReturnDelta: false,
        afterRemoveLiquidityReturnDelta: false
      });
  }
}
