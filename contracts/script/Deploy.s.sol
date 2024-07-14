// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { BaseScript } from "./Base.s.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { Hooks } from "@uniswap/v4-core/src/libraries/Hooks.sol";
import { VaultFactory } from "src/VaultFactory.sol";
import { WrappedNative } from "src/WrappedNative.sol";
import { CushionHook } from "src/CushionHook.sol";
import { console2 } from "forge-std/src/console2.sol";

import { HookMiner } from "./HookMiner.sol";

/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract Deploy is BaseScript {
  IPoolManager constant BASE_SEPOLIA_POOL_MANAGER = IPoolManager(0xFC885F37F5A9FA8159c8dBb907fc1b0C2fB31323);
  address constant CREATE2_DEPLOYER = address(0x4e59b44847b379578588920cA78FbF26c0B4956C);

  function run() public broadcast {
    address wrappedNative = address(new WrappedNative());
    VaultFactory factory = new VaultFactory(broadcaster, BASE_SEPOLIA_POOL_MANAGER, wrappedNative);

    uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG | Hooks.AFTER_ADD_LIQUIDITY_FLAG | Hooks.AFTER_REMOVE_LIQUIDITY_FLAG);
    // Mine a salt that will produce a hook address with the correct flags
    (address hookAddress, bytes32 salt) = HookMiner.find(
      CREATE2_DEPLOYER,
      flags,
      type(CushionHook).creationCode,
      abi.encode(address(BASE_SEPOLIA_POOL_MANAGER), address(factory))
    );

    CushionHook hook = new CushionHook{ salt: salt }(BASE_SEPOLIA_POOL_MANAGER, factory);
    factory.setHook(address(hook));

    factory.launchCushionToken("Mock Token", "MOCK", 1e18);

    console2.log("Deployed CushionHook at", address(hook));
  }
}
