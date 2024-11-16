// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import {IPair} from "src/interface/IPair.sol";
import {IERC20} from "src/interface/IERC20.sol";
import {WETH} from "@solady/contracts/tokens/WETH.sol";

contract Router {
    WETH public immutable weth;

    constructor (address w) {
        weth = WETH(payable(w));
    }

    function addLiquidity(address _pair, uint256 _amount) external payable returns (uint256 shares) {
        weth.deposit{value: msg.value}();
        weth.approve(_pair, msg.value);
        IPair(_pair).token1().transferFrom(msg.sender, address(this), _amount);
        IPair(_pair).token1().approve(_pair, _amount);
        return IPair(_pair).addLiquidity(msg.value, _amount);
    }

    function removeLiquidity(address _pair, uint256 _shares) external returns (uint256 amount0, uint256 amount1) {
        return IPair(_pair).removeLiquidity(_shares);
    }

    function swapETH(address _pair) external payable returns (uint256 amountOut) {
        weth.deposit{value: msg.value}();
        weth.approve(_pair, msg.value);
        return IPair(_pair).swap(address(weth), msg.value);
    }

    function swap(address _pair, address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut) {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(_pair, _amountIn);
        return IPair(_pair).swap(_tokenIn, _amountIn);
    }
}
