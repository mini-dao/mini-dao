// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import {Pair} from "src/Pair.sol";
import {Tkn} from "src/Tkn.sol";
import {IERC20} from "src/IERC20.sol";
import {Router} from "src/Router.sol";

struct Token {
    address a;
    address b;
}

contract DeployAMM is Script {
    function run() public {
        uint256 signer = vm.envUint("PRIVATE_KEY");
        address pubKey = vm.addr(signer);
        console2.log("Pub Key: ", pubKey);
        console2.log("Balance: ", pubKey.balance);

        vm.startBroadcast(signer);

        Tkn pepe = new Tkn("Pepe", "PEPE", 6, 1_000_000);
        Tkn doge = new Tkn("Doge", "DOGE", 6, 1_000_000);
        Tkn shib = new Tkn("Shib", "SHIB", 6, 1_000_000);
        Tkn trump = new Tkn("Trump", "TRUMP", 6, 1_000_000);
        Tkn usdc = new Tkn("USDC", "USDC", 6, 1_000_000_000_000_000_000);

        Pair pepePair = new Pair(address(pepe), address(usdc));
        Pair dogePair = new Pair(address(doge), address(usdc));
        Pair shibPair = new Pair(address(shib), address(usdc));
        Pair trumpPair = new Pair(address(trump), address(usdc));

        Router router = new Router();

        pepe.approve(address(router), type(uint256).max);
        doge.approve(address(router), type(uint256).max);
        shib.approve(address(router), type(uint256).max);
        trump.approve(address(router), type(uint256).max);
        usdc.approve(address(router), type(uint256).max);

        router.addLiquidity(address(pepePair), IERC20(address(pepe)).balanceOf(pubKey), IERC20(address(usdc)).balanceOf(pubKey) / 8);
        router.addLiquidity(address(dogePair), IERC20(address(doge)).balanceOf(pubKey), IERC20(address(usdc)).balanceOf(pubKey) / 8);
        router.addLiquidity(address(shibPair), IERC20(address(shib)).balanceOf(pubKey), IERC20(address(usdc)).balanceOf(pubKey) / 8);
        router.addLiquidity(address(trumpPair), IERC20(address(trump)).balanceOf(pubKey), IERC20(address(usdc)).balanceOf(pubKey) / 8);

        console2.log("Router: ", address(router));
        console2.log("Pepe Pair: ", address(pepePair));
        console2.log("Doge Pair: ", address(dogePair));
        console2.log("Shib Pair: ", address(shibPair));
        console2.log("Trump Pair: ", address(trumpPair));
        console2.log("Pepe: ", address(pepe));
        console2.log("Doge: ", address(doge));
        console2.log("Shib: ", address(shib));
        console2.log("Trump: ", address(trump));
        console2.log("USDC: ", address(usdc));

        vm.stopBroadcast();
    }
}
