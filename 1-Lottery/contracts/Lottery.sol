// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract Lottery{

    /////////////////////////////
    // Public Variables

    // Contract Owner Address
    address payable public Lottery_Owner;

    // Ticket Cost
    uint256 constant  Quarter_Ticket_Cost = 125000000 gwei;
    uint256 constant  Half_Ticket_Cost = 250000000 gwei;
    uint256 constant  Full_Ticket_Cost = 500000000 gwei;

    // Ticket Types
    uint8 constant Full_Ticket = 1;
    uint8 constant Half_Ticket = 2;
    uint8 constant Quarter_Ticket = 4;

    // Maximum Ticket Count
    uint8 constant MAXIMUM_TICKET_COUNT = 3;

    ///////////////////
    // Player Struct
    struct Lottery_Player{
        
        // Player Addr
        address player_adr;

        // Player Ticket;
        // 3: Full, 2: Half, 1: Quarter ticket  
        uint8 ticket_type;

    }

    // Player Array
    Lottery_Player[] public Players;

    // Ticket Counter
    mapping(address => uint8) Ticket_Count;

    // Player Struct
    ///////////////////
    
    // Total Amount
    uint256 private Total_Ticket_Sales;

    // Total Ticket Salec
    uint256 public Total_Quarter_Ticket;
    uint256 public Total_Half_Ticket;
    uint256 public Total_Full_Ticket;

    // Last Winner Adr
    address public Last_Winner_Adr;
    
    // Public Variables
    /////////////////////////////
    
    // Event
    event New_Player(address indexed player_adr);

    // Contract Constructor
    constructor(){
        Lottery_Owner  = payable(msg.sender);
    }

    
    // Authority Check modifier
    modifier onlyAuthorized(){
        require(msg.sender == Lottery_Owner);
        _;
    }


    // Buy a ticket
    function buy_a_ticket(uint8 _ticket_type) public payable {

        // Owner can not buy a ticket
        require(msg.sender != Lottery_Owner);

        // Maximum ticket count is 100
        require(Total_Ticket_Sales <= 100);

        // Check Minimum Ticket Value
        require(msg.value >= Quarter_Ticket_Cost);

        // Check the maximum ticket count (Player can buy maximum 3 ticket)
        require(Ticket_Count[msg.sender] < MAXIMUM_TICKET_COUNT);

        // Assign a ticket type and check Value
        if(_ticket_type == Quarter_Ticket){
            require(msg.value == Quarter_Ticket_Cost);
            Total_Quarter_Ticket++;
        } else if(_ticket_type == Half_Ticket){
            require(msg.value == Half_Ticket_Cost);
            Total_Half_Ticket++;
        } else if(_ticket_type == Full_Ticket){
            require(msg.value == Full_Ticket_Cost);
            Total_Full_Ticket++;
        } else { require(false);}

        Total_Ticket_Sales++;

        // Create Local Player Struct
        Lottery_Player memory newplayer = Lottery_Player({
            player_adr:msg.sender,
            ticket_type: _ticket_type
        });

        // Assign 
        Ticket_Count[msg.sender]++;
        Players.push(newplayer);

        emit New_Player(msg.sender);
    
    }

    //Create a random index for winner
    function random() private view returns(uint){
        return ((uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%Total_Ticket_Sales));
    }

    // Total Balance
    function get_balance() public view returns(uint256){
        return address(this).balance;
    }

    // transfer reward
    function transfer_reward(address payable _to, uint256 winner_index) onlyAuthorized private{

        // Transfer reward the winner
        if(Players[winner_index].ticket_type == Quarter_Ticket){
              _to.transfer((get_balance()/Quarter_Ticket));
        }else if(Players[winner_index].ticket_type == Half_Ticket){
            _to.transfer((get_balance()/Half_Ticket));
        }else if(Players[winner_index].ticket_type == Full_Ticket){
            _to.transfer((get_balance()/Full_Ticket));
        }

        // Transfer the remaining reward to the contract owner  
        require(get_balance() != 0);
        Lottery_Owner.transfer(get_balance());
     
    }

    // Restart Lottery
    function restart_lottery() onlyAuthorized private{

    // Reset Ticket Count and Players
    uint256 playerCount= Players.length;
    for(uint256 i = 0; i<playerCount; i++){
            delete Ticket_Count[Players[i].player_adr];
            delete Players[i];
    }

    // Reset  Total Amount
    Total_Ticket_Sales = 0;

    // Total Ticket Salec
    Total_Quarter_Ticket = 0;
    Total_Half_Ticket = 0;
    Total_Full_Ticket = 0;
        
    }

    // Pick a Winner
    function selectWinner() public onlyAuthorized returns(address){

        uint index = random();
        address payable Winner_Addres =  payable(Players[index].player_adr);
        transfer_reward(Winner_Addres,index);
        restart_lottery();
        Last_Winner_Adr = Winner_Addres;
        return Winner_Addres;        
        
    }


    // Get Total Ticket Sales
    function get_total_tickets() public view returns(uint256)
    {
        return (Total_Ticket_Sales);
    }
    


}

