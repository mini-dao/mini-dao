// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import {IERC20} from "src/interface/IERC20.sol";

contract SendToken is Script {
    function run() external {
        uint256 signer = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(signer);
        send(0x8aBda98A48B9CBdf39cd9566c3099Ce05ad5a61e, 0xE7Ea11BB090FF7Ee3b040b96aa01c6D169364809, IERC20(0x8aBda98A48B9CBdf39cd9566c3099Ce05ad5a61e).balanceOf(address(this)) / 3);
        vm.stopBroadcast();
    }

    function send(address _token, address _to, uint256 _amount) internal {
        IERC20(_token).transfer(_to, _amount);
    }
}