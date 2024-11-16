// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import {IPair} from "src/interface/IPair.sol";
import {IERC20} from "src/interface/IERC20.sol";
import {WETH} from "@solady/contracts/tokens/WETH.sol";
import {DataTypes} from "src/libraries/DataTypes.sol";
import {Events} from "src/libraries/Events.sol";

contract Router {
    WETH public immutable weth;

    constructor (address w) {
        weth = WETH(payable(w));
    }

    function addLiquidity(address _pair, uint256 _amount) external payable returns (uint256 shares, DataTypes.LiquidityChangeData memory liquidityChangeData) {
        weth.deposit{value: msg.value}();
        weth.approve(_pair, msg.value);
        IPair(_pair).token1().transferFrom(msg.sender, address(this), _amount);
        IPair(_pair).token1().approve(_pair, _amount);
        (shares, liquidityChangeData) = IPair(_pair).addLiquidity(msg.value, _amount);
        emit Events.LiquidityChange(msg.sender, liquidityChangeData);
    }

    function removeLiquidity(address _pair, uint256 _shares) external returns (uint256 amount0, uint256 amount1, DataTypes.LiquidityChangeData memory liquidityChangeData) {
        return IPair(_pair).removeLiquidity(_shares);
    }

    function buy(address _pair) external payable returns (uint256 amountOut, DataTypes.SwapData memory swapData) {
        weth.deposit{value: msg.value}();
        weth.approve(_pair, msg.value);
        (amountOut, swapData) = IPair(_pair).swap(address(weth), msg.value);
        IPair(_pair).token1().transfer(msg.sender, amountOut);
        emit Events.Swap(msg.sender, swapData);
    }

    function sell(address _pair, address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut, DataTypes.SwapData memory swapData) {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(_pair, _amountIn);
        (amountOut, swapData) = IPair(_pair).swap(_tokenIn, _amountIn);
        weth.withdraw(amountOut);
        payable(msg.sender).transfer(amountOut);
        emit Events.Swap(msg.sender, swapData);
    }
}
