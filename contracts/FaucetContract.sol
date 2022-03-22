// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

//Faucet inherits Owned functionalities and properties
contract Faucet is Owned, Logger, IFaucet {
    //address[] public funders;
    uint256 public numberOfFunders;

    mapping(address => bool) private funders;
    mapping(uint256 => address) private lutFunders; //look up table

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        _; //will execute the rest of the function statement
    }

    //Receives ETH - called when you make a tx that doesnt specify function name to call
    //external functions are part of the contract interface which means they can be called via contracts and other tx
    receive() external payable {}

    //Must implement function from Logger
    function emitLog() public pure override returns (bytes32) {
        return "Hello World!";
    }

    //Add funds to our smart contract
    function addFunds() external payable override {
        //msg is a global variable which contains transaction data
        //push sender to funders array - to record address
        //funders.push(msg.sender); -- array push
        address funder = msg.sender;

        //If current funder does not exist in funders
        if (!funders[funder]) {
            uint256 index = numberOfFunders++; //increment count -- assign to index in order to start at 0;
            funders[funder] = true; //add to mapping
            lutFunders[index] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount)
        external
        payable
        override
        limitWithdraw(withdrawAmount)
    {
        //checks
        //minimum, check if the contract has enoufh balance
        //require condition has to be met in order to execute the next line of code -- else the message will display
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }

    //To return mapping, transfer values ifrom mapping into an [] and return that array
    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numberOfFunders);
        for (uint256 i = 0; i < numberOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        //address[] memory _funders = getAllFunders();
        return lutFunders[index];
    }

    function test1() external onlyOwner {
        //only owner has access to
    }

    function test2() external onlyOwner {
        //only owner has access to
    }

    //read-only call, no gas fee
    //View - indicates that the function will not alter the storage state in any way
    //Pure - even more strict, it wont even read the storage state
    // function justTesting() public pure returns (uint256) {
    //     return 2 + 2;
    // }

    //to talk to the node on the network you can make JSON_RPC http calls
}

//const instance = await Faucet.deployed()
// instance.addFunds({from: accounts[0], value: "2000000000000000000"})
