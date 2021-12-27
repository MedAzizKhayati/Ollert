import React from "react";
import '../style/CreateTaskPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../api/users';

const CreateTask = (props) => {
    const navigate = useNavigate();
    const [Task, setTask] = React.useState({});
    const [user, setUser] = React.useState(props.user);
    const today = new Date().toISOString().split("T")[0];
    React.useEffect(() => {
        fetchUser().then(user => {
            if (user && user.role == 'CHEF')
                setUser(user)
            else
                navigate('/Tasks')
        });
    });
    const [project,setProject] = React.useState(window.location.pathname.split("/").at(-2)) ;

    return (
        <div className="outer" >
            <div className="inner">
                <h1 style={{ textAlign: 'center' }}>Add Task</h1>
                <form>
                    <div className="form-group">
                        <label >Task Name</label>
                        <input type="text" name="name" className="form-control" placeholder="Ollert" />
                    </div>
                    <div className="form-group">
                        <label>Task Project</label>
                        <input type="text" name="project" className="form-control" placeholder={project} disabled />
                    </div>
                    <div className="form-group">
                        <label >Task Description</label>
                        <textarea
                            name="description" className="form-control" rows="3"
                            placeholder="example : Create an add Task page"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label >Task Deadline</label>
                        <input type="date" min={today}
                            onChange={e => console.log(e.target.value)}
                            value={today} name="deadline" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label >Task state</label>
                        <select className="form-control" name="state">
                            <option>Todo</option>
                            <option>Doing</option>
                            <option>Done</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label >User responsible for task</label>
                        <input type="text" name="user" className="form-control" placeholder="Enter the user id or leave empty" />
                    </div>
                </form>
            </div>
        </div>
    );

}

export default CreateTask;
