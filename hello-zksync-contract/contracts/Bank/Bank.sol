// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    mapping (address => uint256) public balance;

    function deposit() public payable {
        balance[msg.sender] += msg.value;
    }

     function withdraw() public      {
       (bool sent, ) = msg.sender.call{value: balance[msg.sender]}("");
       require(sent, "Failed to send ether");
       balance[ msg.sender]=0;

    }

    receive() external payable {
        deposit();
     }
}