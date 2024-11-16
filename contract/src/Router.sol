// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import {IPair} from "./interface/IPair.sol";
import {IERC20} from "./IERC20.sol";

contract Router {
    function addLiquidity(address _pair, uint256 _amount0, uint256 _amount1) external returns (uint256 shares) {
        IPair(_pair).token0().transferFrom(msg.sender, address(this), _amount0);
        IPair(_pair).token0().approve(_pair, _amount0);
        IPair(_pair).token1().transferFrom(msg.sender, address(this), _amount1);
        IPair(_pair).token1().approve(_pair, _amount1);
        return IPair(_pair).addLiquidity(_amount0, _amount1);
    }

    function removeLiquidity(address _pair, uint256 _shares) external returns (uint256 amount0, uint256 amount1) {
        return IPair(_pair).removeLiquidity(_shares);
    }

    function swap(address _pair, address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut) {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(_pair, _amountIn);
        return IPair(_pair).swap(_tokenIn, _amountIn);
    }
}
