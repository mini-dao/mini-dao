// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CPAMM} from "../src/CPAMM.sol";

struct Token {
    address a;
    address b;
}

contract CPAMMScript is Script {
    CPAMM public cPAMM;

    function setUp() public {}

    function run() public {
        uint256 signer = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(signer);

        Token memory token = _fetchTokens(block.chainid);

        cPAMM = new CPAMM(token.a, token.b);

        vm.stopBroadcast();
    }

    function _fetchTokens(uint256 _chainId) internal pure returns (Token memory _token) {
        if (_chainId == 25925) {
            _token = Token({
                a: 0x37f57Ae5c5662191a5d87d94C8A8445Ee2e2AbA7,
                b: 0x1f86F79F109060725b6f4146bAeE9b7aca41267d
            });
        } else if (_chainId == 137) {
            _token = Token({
                a: 0x1f86F79F109060725b6f4146bAeE9b7aca41267d,
                b: 0x4200000000000000000000000000000000000006
            });
        }
    }
}
