// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { BaseHook } from "v4-periphery/BaseHook.sol";

import { Reserves } from "@uniswap/v4-core/src/libraries/Reserves.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { Hooks } from "@uniswap/v4-core/src/libraries/Hooks.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { BalanceDelta, BalanceDeltaLibrary } from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import { SafeCast } from "@uniswap/v4-core/src/libraries/SafeCast.sol";
import { Currency, CurrencyLibrary } from "@uniswap/v4-core/src/types/Currency.sol";

import { VaultFactory } from "./VaultFactory.sol";

contract CushionHook is BaseHook {
  using BalanceDeltaLibrary for BalanceDelta;
  using CurrencyLibrary for Currency;
  using Reserves for Currency;
  using SafeCast for uint256;

  VaultFactory public immutable vaultFactory;
  uint256 public constant FIXED_HOOK_FEE = 0.0001e18;

  constructor(IPoolManager poolManager_, VaultFactory vaultFactory_) BaseHook(poolManager_) {
    vaultFactory = vaultFactory_;
  }

  function afterAddLiquidity(
    address,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata params,
    BalanceDelta delta,
    bytes calldata
  ) external override returns (bytes4, BalanceDelta) {
    bool insuredIsZero = !(key.currency0 == (Currency.wrap(vaultFactory.wrappedNative())));
    address insured = insuredIsZero ? Currency.unwrap(key.currency0) : Currency.unwrap(key.currency1);

    int128 amountInsured = insuredIsZero ? delta.amount0() : delta.amount1();
    int128 amountWNative = insuredIsZero ? delta.amount1() : delta.amount0();
    vaultFactory.increaseCushionRiskFactor(
      vaultFactory.tokenToVault(insured),
      uint128(amountInsured),
      uint128(amountWNative)
    );
  }

  function afterRemoveLiquidity(
    address,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata,
    BalanceDelta delta,
    bytes calldata
  ) external override returns (bytes4, BalanceDelta) {
    bool insuredIsZero = !(key.currency0 == (Currency.wrap(vaultFactory.wrappedNative())));
    address insured = insuredIsZero ? Currency.unwrap(key.currency0) : Currency.unwrap(key.currency1);

    int128 amountInsured = insuredIsZero ? delta.amount0() : delta.amount1();
    int128 amountWNative = insuredIsZero ? delta.amount1() : delta.amount0();
    vaultFactory.decreaseCushionRiskFactor(
      vaultFactory.tokenToVault(insured),
      uint128(amountInsured),
      uint128(amountWNative)
    );
  }

  function afterSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    BalanceDelta delta,
    bytes calldata
  ) external override returns (bytes4, int128) {
    uint256 fee = 0;
    bool insuredIsZero = !(key.currency0 == (Currency.wrap(vaultFactory.wrappedNative())));
    address insured = insuredIsZero ? Currency.unwrap(key.currency0) : Currency.unwrap(key.currency1);

    // Taking a dynamic fee when selling insured token
    if ((insuredIsZero && delta.amount0() < 0) || (!insuredIsZero && delta.amount1() < 0)) {
      uint256 insuredReserves = insuredIsZero ? key.currency0.getReserves() : key.currency1.getReserves();
      int128 insuredSellAmount = insuredIsZero ? delta.amount0() : delta.amount1();
      fee = calculateDynamicFee(insuredSellAmount, insuredReserves);

      manager.mint(
        vaultFactory.tokenToVault(insured),
        insuredIsZero ? key.currency1.toId() : key.currency0.toId(),
        fee
      );
      // Take a fixed fee when buying the insured token
    } else {
      fee = FIXED_HOOK_FEE;
      manager.mint(vaultFactory.tokenToVault(insured), key.currency0.toId(), fee);
    }

    return (BaseHook.afterSwap.selector, insuredIsZero ? fee.toInt128() : -fee.toInt128());
  }

  function calculateDynamicFee(int128 insuredAmountSold, uint256 reserves) public pure returns (uint256) {
    uint256 amountSold = insuredAmountSold < 0 ? uint128(-insuredAmountSold) : uint128(insuredAmountSold);
    return (amountSold * 1e18) / reserves;
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
