# To Do List
A Blockchain app to keep track of your activities

---
## Features-
1. Add Task - Takes the user prompt and adds a task into the smart contract
2. Refresh Tasks - Reads the tasks from the smart contract and renders onto the UI
3. Complete Task - When a task is checked on the UI, a transaction is made with the smart contract to update status of the task. This task will then show up as per the status on the UI

## Steps to execute-
1. Clone the repo
2. Launch ganache on local machine and connect couple of accounts with metamask
3. Run `truffle migrate --reset`
4. Run `npm run dev`
