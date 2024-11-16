// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import {DataTypes} from "src/libraries/DataTypes.sol";

library Events {
    event Swap(address indexed sender, DataTypes.SwapData swapData);
    event LiquidityChange(address indexed sender, DataTypes.LiquidityChangeData liquidityChangeData);
}
