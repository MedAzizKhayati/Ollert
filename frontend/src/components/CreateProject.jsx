import React from "react";
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../api/users';

const CreateProject = (props) => {
    const navigate = useNavigate();
    const [project, setProject] = React.useState({});
    const [user, setUser] = React.useState(props.user);
    const today = new Date().toISOString().split("T")[0];
    React.useEffect(() => {
        fetchUser().then(user => {
            if (user && user.role == 'CHEF')
                setUser(user)
            else
                navigate('/projects')
        });
    });

    return (
        <div className="outer" >
            <div className="inner">
                <h1 style={{ textAlign: 'center' }}>Create Project</h1>
                <form>
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
                            onChange={e => console.log(e.target.value)}
                            value={today} name="deadline" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label >Project Members</label>
                        <textarea className="form-control" rows="3"></textarea>
                    </div>
                </form>
            </div>
        </div>
    );

}
export default CreateProject;