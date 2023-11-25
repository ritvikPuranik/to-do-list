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
        // let taskNumber = id.split('-')[1];
        // console.log("complete task methods called!>>", taskNumber);
        // let task = await instance.methods.tasks(taskNumber).call();
        await instance.methods.updateTask().send({"from": userAccount, "gas": 3000000});
        await renderTasks();

    }

    const renderTasks = async() =>{
        taskList.innerHTML = ""; //Erase all existing tasks from ui
        let accountBalance = await web3.eth.getBalance(userAccount);
        document.querySelector('#user-account').innerHTML = `Your address: ${userAccount}`;
        document.querySelector('#account-balance').innerHTML = `Account Balance: ${web3.utils.fromWei(accountBalance)} ether`;

        let response = await instance.methods.accounts(userAccount).call();
        let taskId = response[0];
        let {name, isComplete} = response[1];
        // console.log("Response from accounts>", isComplete);

        if(response.taskLength > 0){
            let row = document.createElement('li');
            if(isComplete){
                row.innerHTML = `<div class="form-check p-0">
                    <input class="form-check-input float-none mr-3" type="checkbox" value="" id="task-${taskId}" checked>
                    <label class="form-check-label" for="task-${taskId}">
                        ${name}
                    </label>
                    </div>`;
            }else{
                row.innerHTML = `<div class="form-check p-0">
                    <input class="form-check-input float-none mr-3" type="checkbox" value="" id="task-${taskId}">
                    <label class="form-check-label" for="task-${taskId}">
                        ${name}
                    </label>
                    </div>`;
            }
            taskList.append(row);
            addClickListener(`task-${taskId}`);
        }
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
