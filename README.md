# To Do List
A Blockchain app to keep track of your activities. This displays the tasks unique to each account of metamask that is connected to the site.

---
## Features-
1. Add Task - Takes the user prompt and adds a task into the smart contract. This is mapped to the account address that creates the task.
2. Refresh Tasks - Reads the tasks from the smart contract and renders onto the UI
3. Complete Task - When a task is checked on the UI, a transaction is made with the smart contract to update status of the task. This task will then show up as per the status on the UI

## Steps to execute-
1. Clone the repo
2. Launch ganache on local machine and connect couple of accounts with metamask
3. Run `truffle migrate --reset`
4. Run `npm run dev`
5. Once the site is launched, play around with creating tasks/ completing tasks from different MetaMask accounts connected to the site. The app will keep track of each task associated with an account.
