// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract ToDoList {
  address public owner;

  mapping(string => bool) public taskStatus;
  string[] public tasks;
  uint public length;

  constructor() {
    owner = msg.sender;
  }

  function updateTask(string memory _task) public {
    // require(msg.sender == owner, "You are not the owner, please switch accounts");
    taskStatus[_task] = !taskStatus[_task];
  }

  function addTask(string memory _taskName) public {
    tasks.push(_taskName);
    taskStatus[_taskName] = true;
    length++;
  }

}
