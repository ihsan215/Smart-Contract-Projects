// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Lottery{

    address public manager;
    address[] public players;

    constructor(){
        manager = msg.sender;
    }

  


    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encode(block.prevrandao, block.timestamp,players)));
    }

    function pickWinner() public onlyManager{
      
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
      
    }

    modifier onlyManager(){
        require(msg.sender == manager);
        _;

    }

    function returnArrays() public view returns(address[] memory){
        return players;
    }

}