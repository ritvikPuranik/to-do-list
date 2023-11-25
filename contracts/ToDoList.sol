// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract ToDoList {
  struct Task{
    string name;
    bool isComplete;
  }

  struct Account{
    uint8 taskLength;
    // mapping (uint8 => Task) taskList;
    Task taskList;
    // Task[] taskList;
  }

  mapping(address => Account) public accounts;
//   mapping(uint8 => Task) public taskListPublic;
  
  function updateTask() public {
    require(accounts[msg.sender].taskLength > 0, "No tasks to update");
    accounts[msg.sender].taskList.isComplete = !accounts[msg.sender].taskList.isComplete;
  }

  function addTask(string memory _taskName) public {
    Task memory newTask = Task(_taskName, false);
    
    accounts[msg.sender] = Account({
      taskLength: 1,
      taskList: newTask
    });    

  }

}
