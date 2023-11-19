document.addEventListener("DOMContentLoaded", function () {
    web3 = new Web3("http://127.0.0.1:7545");
    let abi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_taskName",
                    "type": "string"
                }
            ],
            "name": "addTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_task",
                    "type": "string"
                }
            ],
            "name": "updateTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "length",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "tasks",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "taskStatus",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    let contractAddress = '0x5A1Bb164D1B94FdE8De9117D8642e1c186653250';

    let instance = null;
    let userAccount = null;
    
    const submitAction = async()  => {
        console.log("Contract Being deployed!");
        try{
            instance = new web3.eth.Contract(abi, contractAddress);
            let owner = await instance.methods.owner().call();
            console.log("contractIntance>", owner);
            // alert("success!!");
            document.querySelector('#list-container').classList.remove('invisible');
            document.querySelector('#deploy-contract').classList.add('invisible');
        }catch(err){
            alert("contract deployment failed");
            console.log("err>>", err);
        }
        
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                userAccount = account;
                document.querySelector('#user-account').innerHTML = `Your address: ${account}`;
            }
        });
    }

    const createTask = async() =>{
        try{
            let task = prompt("Enter your task", "Go for a run...");
            await instance.methods.addTask(task).send({"from": userAccount});
            await renderTasks();
        }catch(err){
            console.log("task creation failed!");
        }
    }

    const completeTask = async(id) =>{
        let taskNumber = id.split('-')[1];
        console.log("complete task methods called!>>", taskNumber);
        let task = await instance.methods.tasks(taskNumber).call();
        await instance.methods.updateTask(task).send({"from": userAccount});
        await renderTasks();

    }

    const renderTasks = async() =>{
        taskList.innerHTML = "";
        let tasksLength = await instance.methods.length().call();
        let pendingTasks = [];
        let completedTasks = [];
        for(let i=0; i<tasksLength; i++){
            let task = await instance.methods.tasks(i).call();
            let taskStatus = await instance.methods.taskStatus(task).call();
            taskStatus ? pendingTasks.push([i,task]) : completedTasks.push([i,task]);
        }
        
        pendingTasks.map(item =>{
            let row = document.createElement('li');
            row.innerHTML = `<div class="form-check p-0">
                <input class="form-check-input float-none mr-3" type="checkbox" value="" id="task-${item[0]}">
                <label class="form-check-label" for="task-${item[0]}">
                    ${item[1]}
                </label>
                </div>`;
            taskList.append(row);
            addClickListener(`task-${item[0]}`);
        })

        completedTasks.map(item =>{
            let row = document.createElement('li');
            row.innerHTML = `<div class="form-check p-0">
                <input class="form-check-input float-none mr-3" type="checkbox" value="" id="task-${item[0]}" checked>
                <label class="form-check-label" for="task-${item[0]}">
                    ${item[1]}
                </label>
                </div>`;
        taskList.append(row);
        addClickListener(`task-${item[0]}`);
        })
    }

    const addClickListener = (itemId) =>{
        let checkbox = taskList.querySelector(`#${itemId}`);
        checkbox.addEventListener('click', (e)=>{
            completeTask(itemId);
        })

    }

    document.querySelector('#deploy-contract').onclick = submitAction;
    document.querySelector('#create-task').onclick = createTask;
    document.querySelector('#render-tasks').onclick = renderTasks;
    
    let taskList = document.querySelector("#task-list");
    
    
});
