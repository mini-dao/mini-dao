// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import {Pair} from "src/Pair.sol";
import {Tkn} from "src/Tkn.sol";
import {IERC20} from "src/interface/IERC20.sol";
import {WETH} from "@solady/contracts/tokens/WETH.sol";
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
        WETH weth = new WETH();

        Pair pepePair = new Pair(address(weth), address(pepe));
        Pair dogePair = new Pair(address(weth), address(doge));
        Pair shibPair = new Pair(address(weth), address(shib));
        Pair trumpPair = new Pair(address(weth), address(trump));

        Router router = new Router(address(weth));

        pepe.approve(address(router), type(uint256).max);
        doge.approve(address(router), type(uint256).max);
        shib.approve(address(router), type(uint256).max);
        trump.approve(address(router), type(uint256).max);

        router.addLiquidity{value: pubKey.balance / 8}(address(pepePair), IERC20(address(pepe)).balanceOf(pubKey));
        router.addLiquidity{value: pubKey.balance / 8}(address(dogePair), IERC20(address(doge)).balanceOf(pubKey));
        router.addLiquidity{value: pubKey.balance / 8}(address(shibPair), IERC20(address(shib)).balanceOf(pubKey));
        router.addLiquidity{value: pubKey.balance / 8}(address(trumpPair), IERC20(address(trump)).balanceOf(pubKey));

        router.buy{value: pubKey.balance / 8}(address(pepePair));
        router.sell(address(pepePair), IERC20(address(pepe)).balanceOf(pubKey));

        console2.log("Router: ", address(router));
        console2.log("Pepe Pair: ", address(pepePair));
        console2.log("Doge Pair: ", address(dogePair));
        console2.log("Shib Pair: ", address(shibPair));
        console2.log("Trump Pair: ", address(trumpPair));
        console2.log("Pepe: ", address(pepe));
        console2.log("Doge: ", address(doge));
        console2.log("Shib: ", address(shib));
        console2.log("Trump: ", address(trump));
        console2.log("WETH: ", address(weth));

        vm.stopBroadcast();
    }
}
