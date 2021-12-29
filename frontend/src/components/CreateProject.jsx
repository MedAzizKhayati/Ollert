import React from "react";
import { useNavigate } from 'react-router-dom';
import { fetchUser, queryUsers } from '../api/users';
import { createProject } from '../api/projects';
import AsyncSelect from 'react-select';
import makeAnimated from 'react-select/animated';


const CreateProject = (props) => {
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const today = new Date().toISOString().split("T")[0];

    const [project, setProject] = React.useState({ type: 'Web Application', deadline: today});
    const [user, setUser] = React.useState(props.user);
    const [query, setQuery] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const [members, setMembers] = React.useState([]);
    const [flash, setFlash] = React.useState({});

    React.useEffect(() => {
        fetchUser().then(user => {
            if (user && user.role == 'CHEF')
                setUser(user)
            else
                navigate('/projects')
        });
    });

    const onFormSubmit = e => {
        e.preventDefault();
        createProject(project).then((response) => {
            if (response.success)
                setTimeout(() => navigate('/projects'), 1000)
            setFlash(response)
        })
    }

    const onFormChange = e => {
        let temp = project;
        if (e.target.name)
            temp[e.target.name] = e.target.value;
        temp["users"] = members;
        temp["id_project_manager"] = user.id;
        setProject(temp);
    }

    const loadOptions = async (query) => {
        const options = (await queryUsers(query)).map(user => {
            return { value: user.id, label: user.username }
        });
        setOptions(options);
    }

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
                <h1 style={{ textAlign: 'center' }}>Create Project</h1>
                <form onChange={onFormChange}>
                    <div className="form-group">
                        <label >Project Name</label>
                        <input type="text" name="name" className="form-control" placeholder="Ollert" />
                    </div>
                    <div className="form-group">
                        <label>Project Type</label>
                        <select className="form-control" name="type">
                            <option>Web Application</option>
                            <option>Mobile Application</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label >Project Description</label>
                        <textarea
                            name="description" className="form-control" rows="3"
                            placeholder="This is a Trello like Web Project"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label >Project Deadline</label>
                        <input type="date" min={today}
                            defaultValue={today} onChange={e => null} name="deadline" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label >Project Members</label>
                        <AsyncSelect
                            onInputChange={handleInputChange}
                            onChange={selected => setMembers(selected.map(member => member.value))}
                            components={animatedComponents}
                            isMulti
                            cacheOptions
                            className="basic-multi-select"
                            options={options}
                        />
                    </div>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={onFormSubmit} className="btn btn-primary">Create Project</button>
                    </div>
                    {flash.success ?
                        <div className="alert alert-success" role="alert">
                            {flash.success}
                        </div>
                        : null
                    }
                    {flash.error ?
                        <div className="alert alert-danger" role="alert">
                            {flash.error}
                        </div>
                        : null
                    }
                </form>
            </div>
        </div>
    );

}
export default CreateProject;