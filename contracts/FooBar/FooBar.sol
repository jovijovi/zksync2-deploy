// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC721A} from "erc721a/contracts/ERC721A.sol";
import {ERC721AQueryable} from "erc721a/contracts/extensions/ERC721AQueryable.sol";

contract FooBarNFT is ERC721AQueryable {
    constructor(string memory name_, string memory symbol_) ERC721A(name_, symbol_) {
        //TODO:
    }
}
