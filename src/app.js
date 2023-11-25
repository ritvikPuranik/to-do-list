document.addEventListener("DOMContentLoaded", async function () {
    let instance = null;
    let abi = null, contractAddress = "";
    let userAccount = null;

    let web3 = new Web3('http://127.0.0.1:7545');

    $.getJSON("ToDoList.json", function(toDoList) {
        console.log("todoList>>", toDoList.abi);
        abi = toDoList.abi;
        contractAddress = toDoList.networks['5777'].address;
        console.log("contractAddress>>", toDoList.networks['5777'].address);
    });

    const onInit = async() => {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        userAccount = account;
        
        window.ethereum.on('accountsChanged', async function (accounts) {
            userAccount = accounts[0];
            await renderTasks();
        });   
    }


    const deployContract = async()  => {
        console.log("Contract Being deployed!");
        try{
            instance = new web3.eth.Contract(abi, contractAddress);
            let owner = await instance.methods.owner().call();
            console.log("contractIntance>", owner);
            await renderTasks();
        }catch(err){
            alert("contract deployment failed");
            console.log("err>>", err);
        }
    }

    const createTask = async() =>{
        try{
            let task = prompt("Enter your task", "Go for a run...");
            await instance.methods.addTask(task).send({"from": userAccount, "gas": 3000000});
            await renderTasks();
        }catch(err){
            console.log("task creation failed!>>", err);
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
        let accountBalance = await web3.eth.getBalance(userAccount);
        document.querySelector('#user-account').innerHTML = `Your address: ${userAccount}`;
        document.querySelector('#account-balance').innerHTML = `Account Balance: ${web3.utils.fromWei(accountBalance)} ether`;

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

    document.querySelector('#create-task').onclick = createTask;
    document.querySelector('#render-tasks').onclick = renderTasks;
    
    let taskList = document.querySelector("#task-list");
    
    await onInit();
    deployContract();
    
});