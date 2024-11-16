// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

interface IPair {
    function reserve0() external view returns(uint256);
    function reserve1() external view returns(uint256);
    function totalSupply() external view returns(uint256);
    function balanceOf(address _account) external view returns(uint256);
    function swap(address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut);
    function addLiquidity(uint256 _amount0, uint256 _amount1) external returns (uint256 shares);
    function removeLiquidity(uint256 _shares) external returns (uint256 amount0, uint256 amount1);
}
