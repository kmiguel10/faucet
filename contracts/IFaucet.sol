// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//Has to implement addFunds and Withdraw
//Restrictions: 1. cannot inherit from other smart contracts, they can only inherit from
//other interfaces
//2. They cannnot declare a constructor
//3. they cannot declare state variables
//4. All declared functions have to be external
interface IFaucet {
    function addFunds() external payable;

    function withdraw(uint256 withdrawAmount) external payable;
}
