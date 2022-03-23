// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//Provides function definition NOT function implementation
//whichever contract inherits this abstract contract must provide the defined functions
//functions are marked as virtual
//Its a way for designer to say that “any child of this abstract contract has to implement the specified methods “
abstract contract Logger {
    uint256 public testNum;

    constructor() {
        testNum = 1000;
    }

    function emitLog() public pure virtual returns (bytes32);

    //internal means function can be called from child smart contract
    //private means it can only be called from within the smart contract -children cant
    //public - functions can be called from outside and within the contract
    //external - functions can be called from outside but NOT within the contract
    function test3() internal pure returns (uint256) {
        return 100;
    }
}
