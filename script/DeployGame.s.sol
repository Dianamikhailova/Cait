// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {NumberGuessingGame} from "../src/NumberGuessingGame.sol";

contract DeployGame is Script {
    function run() external {
        vm.startBroadcast();
        NumberGuessingGame game = new NumberGuessingGame();
        vm.stopBroadcast();
        console.log("Game deployed at:", address(game));
    }
}

