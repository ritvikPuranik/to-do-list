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
        }

    }

    const getTasks = async() =>{
        let taskLength = await contract.methods.accounts(userAccount).call({from: userAccount});
        if(taskLength > 0){
            let allTasks = [];
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
            console.log("allTasks>", allTasks);
            setTasks(allTasks);

        }

    }


    // const TaskTable = ()=>{
    //     console.log("All tasks>", tasks);
    //     return(
    //         {tasks.map(item=>(

    //         ))}
    //     ) 

    // }

    useEffect(()=>{
        const setAccount = async()=>{
            let allAccounts = await accounts;
            if(allAccounts){
                let firstAccount = allAccounts[0];
                setUserAccount(firstAccount);
            }
        }
        setAccount();

    }, [accounts]);

    return(
        <div id="list-container" className="container d-flex flex-column justify-content-center align-items-center vh-100">
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
                    value=""
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