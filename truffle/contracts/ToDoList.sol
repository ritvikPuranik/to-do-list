// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
contract ToDoList {
    struct Task {
        string name;
        bool isComplete;
    }

    struct Account {
        uint8 taskLength;
        Task[] taskList; 
    }

    mapping(address => Account) public accounts;
  
    function updateTask(uint _id) public {
        require(accounts[msg.sender].taskLength > 0, "No tasks to update");
        accounts[msg.sender].taskList[_id].isComplete = !accounts[msg.sender].taskList[_id].isComplete;
    }

    function getTask(uint _taskId) public view returns (string memory, bool) {
        require(_taskId < accounts[msg.sender].taskLength, "Invalid task ID");
        Task memory task = accounts[msg.sender].taskList[_taskId];
        return (task.name, task.isComplete);
    }

    function addTask(string memory _taskName) public {
        Task memory newTask = Task(_taskName, false);

        accounts[msg.sender].taskList.push(newTask);
        accounts[msg.sender].taskLength = uint8(accounts[msg.sender].taskList.length);
    }
}