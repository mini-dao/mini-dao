// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import "@solady/contracts/tokens/ERC20.sol";

contract Tkn is ERC20 {
    uint8 private immutable _decimals;
    uint256 private immutable _totalSupply;
    string private _name;
    string private _symbol;

    constructor(string memory n, string memory s, uint8 d, uint256 t) {
        _totalSupply = t;
        _name = n;
        _symbol = s;
        _decimals = d;
        _mint(msg.sender, t * 10 ** d);
    }

    function name() public view override returns (string memory) { return _name; }
    function symbol() public view override returns (string memory) { return _symbol; }
    function totalSupply() public view override returns (uint256) { return _totalSupply * 10 ** _decimals; }
    function decimals() public view override returns (uint8) { return _decimals; }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}
