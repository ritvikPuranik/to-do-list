import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

const TaskList = () =>{
    const { state: { contract, accounts } } = useEth();
    const [userAccount, setUserAccount] = useState("");
    const [tasks, setTasks] = useState([]);
    
    const addTask = async()=>{
        if(userAccount){
            let task = prompt("Enter Task", "Go for a run");
            const value = await contract.methods.addTask(task).send({from: userAccount});
            console.log("output of addTask>", value);
            await getTasks();
        }
    }

    const getTasks = async() =>{
        let taskLength = await contract.methods.accounts(userAccount).call({from: userAccount});
        let allTasks = [];
        if(taskLength > 0){
            for(let i=0; i<taskLength; i++){
                let taskData = await contract.methods.getTask(i).call({"from": userAccount});
                let taskName = taskData[0];
                let isComplete = taskData[1];
                taskData = {
                    name: taskName,
                    isComplete: isComplete
                }
                allTasks.push(taskData);
            }
        }
        setTasks(allTasks);
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log("accounts changing>>");
            const setAccount = async () => {
            try {
                let allAccounts = await accounts;
                if (allAccounts) {
                let firstAccount = allAccounts[0];
                setUserAccount(firstAccount);
                }
            } catch (error) {
                console.error('Error setting account and fetching tasks:', error);
            }
            };
            setAccount();
        };
        
        fetchData();
    }, [accounts]);

    useEffect(()=>{ //This will rerender tasks on account change. Cannot add into previous hook because the userAccount state variable was asynchronously updating, leaving the tasks one render cycle behind
    const updateTasks = async()=>{
        await getTasks();
    }
    updateTasks();
    }, [userAccount])


    const toggleTask = async(id) =>{
        let taskNumber = id.split('-')[1];
        await contract.methods.updateTask(taskNumber).send({from: userAccount});
        await getTasks();
    }

    return(
        <div id="list-container" className="container d-flex flex-column justify-content-center align-items-center h-25">
          <div className="text-center mt-5 border rounded p-4 shadow">
              <div className="d-flex d-inline justify-content-center align-items-center">
                  <h2 className="m-4">To Do List</h2>
                  <i onClick={addTask} className="fa fa-plus fa-2x m-3"></i>
                  <i onClick={getTasks} className="fa fa-solid fa-arrows-rotate fa-2x"></i>
              </div>
              {tasks.map((item, index) => (
                <div key={index} className="form-check p-0">
                    <input
                    className="form-check-input float-none mr-3"
                    type="checkbox"
                    onChange={() => toggleTask(`task-${index}`) }
                    id={`task-${index}`}
                    checked={item.isComplete}
                    />
                    <label className="form-check-label" htmlFor={`task-${index}`}>
                    {item.name}
                    </label>
                </div>
                ))}
          </div>
        </div>
    )
}

export default TaskList;