// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import {IERC20} from "src/interface/IERC20.sol";
import {DataTypes} from "src/libraries/DataTypes.sol";

interface IPair {
    function token0() external view returns (IERC20);
    function token1() external view returns (IERC20);
    function reserve0() external view returns(uint256);
    function reserve1() external view returns(uint256);
    function totalSupply() external view returns(uint256);
    function balanceOf(address _account) external view returns(uint256);
    function swap(address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut, DataTypes.SwapData calldata swapData);
    function addLiquidity(uint256 _amount0, uint256 _amount1) external returns (uint256 shares, DataTypes.LiquidityChangeData calldata liquidityChangeData);
    function removeLiquidity(uint256 _shares) external returns (uint256 amount0, uint256 amount1, DataTypes.LiquidityChangeData calldata liquidityChangeData);
}
