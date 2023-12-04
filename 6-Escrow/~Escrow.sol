// SPDX-License-Identifier: MIT


pragma solidity ^0.8.16;

contract Solution {
    address public buyer; 
    address payable[] public sellers;
    address public escrowParty; 
    uint public amount; 


    constructor(
        address _buyer,
        address payable[] memory _sellers,
        uint _amount
    ) {
        buyer = _buyer;
        sellers = _sellers;
        escrowParty = msg.sender;
        amount = _amount;
    }


    function deposit() public payable {}

    function release() public onlyEscrowParty {
        require(
            address(this).balance >= amount,
            "Cannot release funds before at least enough money is sent"
        );
        for (uint i = 0; i <= sellers.length - 1; i++) {
            sellers[i].transfer(amount / sellers.length);
        }
    }

    function balanceOf() public view returns (uint) {
        return address(this).balance;
    }

    function changeEscrow(address _newEscrowParty) public onlyEscrowParty {
        escrowParty = _newEscrowParty;
    }

    modifier onlyEscrowParty() {
        require(
            msg.sender == escrowParty,
            "Only escrow party can perform this operation"
        );
        _;
    }
}