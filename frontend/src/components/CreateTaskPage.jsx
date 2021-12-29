import React from "react";
import '../style/CreateTaskPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUser, queryUsers } from '../api/users';
import AsyncSelect from 'react-select';
import makeAnimated from 'react-select/animated';

const CreateTask = (props) => {
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const today = new Date().toISOString().split("T")[0];

    const [options, setOptions] = React.useState([]);
    const [query, setQuery] = React.useState('');
    const [user, setUser] = React.useState(props.user);
    const [member, setMember] = React.useState();
    const [project,setProject] = React.useState(window.location.pathname.split("/").at(-2));
    
    const [task, setTask] = React.useState({id_project:project , deadline: today});
    const [flash, setFlash] = React.useState(false);
    const [flashmsg, setFlashmsg] = React.useState("");

    React.useEffect(() => {
        fetchUser().then(user => {
            if (user && user.role == 'CHEF')
                setUser(user)
            else
                navigate('/Projects/'+project) ;
        });
    });

    const onFormSubmit = async e => {
        console.log(task) ;
        e.preventDefault();
        await axios.post('/api/tasks/create/',task).then((response) => {
            if (response.status == 201)
                setTimeout(() => navigate('/projects/'+project), 300) ;
            setFlash(true)
            setFlashmsg(response.data["msg"])
        }).catch((err) => {
            setFlash(true)
            setFlashmsg("An error has occured")
        })
    }
    const onFormChange = e => {
        let temp = task;
        if (e.target.name)
            temp[e.target.name] = e.target.value;
        temp["user"] = member;
        temp["state"] = document.querySelector(".options").selectedOptions[0].text ;
        setTask(temp);
    }

    /* This Method is called to change the drop options for the search field of the user */
    const loadOptions = async (query) => {
        const options = (await queryUsers(query)).map(user => {
            return { value: user.id, label: user.username }
        });
        setOptions(options);
    }
    /* This method is used as an event listener which gets fired when the user types something in the field of members */
    const handleInputChange = (query) => {
        query = query.replace(/\W/g, '');
        setQuery(query);
        if (query != '')
            loadOptions(query);
        return query;
    }

    return (
        <div className="outer" >
            <div className="inner">
                <h1 style={{ textAlign: 'center' }}>Add Task</h1>
                <form onChange={onFormChange}>
                    <div className="form-group">
                        <label >Task Name</label>
                        <input type="text" name="title" className="form-control" placeholder="Ollert" />
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
                            defaultValue={today} name="deadline" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label >Task state</label>
                        <select className="form-control options" name="state">
                            <option>TODO</option>
                            <option>DOING</option>
                            <option>DONE</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>User responsible for task</label>
                        <AsyncSelect
                            onInputChange={handleInputChange}
                            onChange={selected => setMember(selected.value)}
                            components={animatedComponents}
                            cacheOptions
                            className="basic-multi-select"
                            options={options}
                        />
                    </div>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={onFormSubmit} className="btn btn-primary">Add Task</button>
                    </div>
                    {/* {flash.success ?
                        <div className="alert alert-success" role="alert">
                            {flash.success}
                        </div>
                        : null
                    } */}
                    {flash ?
                        <div className="alert alert-danger" role="alert">
                            {flashmsg}
                        </div>
                        : null
                    }
                </form>
            </div>
        </div>
    );

}

export default CreateTask;
