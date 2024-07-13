// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Simple Wrapped Ether implementation.
/// @author Solady (https://github.com/vectorized/solady/blob/main/src/tokens/WETH.sol)
/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/WETH.sol)
/// @author Inspired by WETH9 (https://github.com/dapphub/ds-weth/blob/master/src/weth9.sol)
contract WrappedNative is ERC20 {
  /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
  /*                       CUSTOM ERRORS                        */
  /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

  /// @dev The ETH transfer has failed.
  error ETHTransferFailed();

  constructor() ERC20("Wrapped Native", "WNATIVE") {}

  /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
  /*                            WETH                            */
  /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

  /// @dev Deposits `amount` ETH of the caller and mints `amount` WETH to the caller.
  function deposit() public payable virtual {
    _mint(msg.sender, msg.value);
  }

  /// @dev Burns `amount` WETH of the caller and sends `amount` ETH to the caller.
  function withdraw(uint256 amount) public virtual {
    _burn(msg.sender, amount);
    /// @solidity memory-safe-assembly
    assembly {
      // Transfer the ETH and check if it succeeded or not.
      if iszero(call(gas(), caller(), amount, codesize(), 0x00, codesize(), 0x00)) {
        mstore(0x00, 0xb12d13eb) // `ETHTransferFailed()`.
        revert(0x1c, 0x04)
      }
    }
  }

  /// @dev Equivalent to `deposit()`.
  receive() external payable virtual {
    deposit();
  }
}
