// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { BaseScript } from "./Base.s.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { VaultFactory } from "src/VaultFactory.sol";
import { MockERC20 } from "src/MockERC20.sol";
import { console2 } from "forge-std/src/console2.sol";

/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract Deploy is BaseScript {
  IPoolManager constant BASE_SEPOLIA_POOL_MANAGER = IPoolManager(0xFC885F37F5A9FA8159c8dBb907fc1b0C2fB31323);

  function run() public broadcast {
    VaultFactory factory = new VaultFactory(BASE_SEPOLIA_POOL_MANAGER);

    MockERC20 token0 = new MockERC20(1e18);
    MockERC20 token1 = new MockERC20(1e18);

    factory.createInsuredPool(address(token0), address(token1));
  }
}
