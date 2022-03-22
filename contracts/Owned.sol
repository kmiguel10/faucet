// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    //checks for owner access only
    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner call call this function");
        _;
    }
}
