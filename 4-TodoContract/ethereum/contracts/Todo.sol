// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;


contract TodoContract {

   

    event editedTodoList(address indexed sender, uint indexed id, TodoList todo);
    

    enum ListSituation{
        unCheck,
        Check
    }

    struct TodoList{
        string ListText;
        ListSituation isComplete;
        uint id;
    }

    mapping(address => mapping(uint => TodoList)) private Todos;

    error InvalidMsg(address sender, string errMsg);

    constructor(){
      
    }


    modifier checkMsgisValid(string calldata _msg){
        if(bytes(_msg).length == 0){
            revert InvalidMsg(msg.sender, "Invalid List Message");
        }
        _;
       
    }


    function addItemtoList(string calldata ListMsg, uint id)  public checkMsgisValid(ListMsg){
        TodoList memory todo = TodoList({
            ListText:ListMsg,
            isComplete: ListSituation.unCheck,
            id: id
        });

        Todos[msg.sender][id] = todo;
        emit editedTodoList(msg.sender,id,todo);
      
    }

    function checkTodoListItem(address adr, uint index) public{
         Todos[adr][index].isComplete = ListSituation.Check;
         emit editedTodoList(adr,index,Todos[adr][index]);
    }


    function getTodo(address adr, uint index) view public returns(TodoList memory){
        return Todos[adr][index];
    }
 
  }


