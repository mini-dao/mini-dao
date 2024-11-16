// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library DataTypes {
    enum LiquidityChangeType { ADD, REMOVE }
    struct LiquidityChangeData {    
        LiquidityChangeType liquidityChangeType;
        address token0;
        address token1;
        uint256 amount0;
        uint256 amount1;
        uint256 shares;
        uint256 reserve0;
        uint256 reserve1;
    }
    struct SwapData {
        uint256 amountIn;
        uint256 amountOut;
        address tokenIn;
        uint256 reserve0;
        uint256 reserve1;
    }
}
