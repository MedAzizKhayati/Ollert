import axios from 'axios';
import React from 'react';
import '../style/Project.scss';


const ProjectEntry = (props) => {

    const [project, setProject] = React.useState(props.project);
    const [status, setStatus] = React.useState({ left: 0, completed: 0, percentage: 5, daysLeft: 0})
    const [members, setMembers] = React.useState([])
    React.useEffect(async () => {
        axios.get('/api/projects/' + project.id + '/users').then((response) => {
            setMembers(response.data);
        }).catch((error) => {
            console.log(error);
        })
        axios.get('/api/tasks/project/' + project.id).then((response) => {
            const tasks = response.data;
            let status = {left: 0, completed: 0};
            tasks.forEach(task => {
                task.state == 'DONE' ? status.completed++ : status.left++;
            });
            status.percentage = status.completed / (status.completed + status.left) * 100;
            const oneDay = 24 * 3600 * 1000;
            status.daysLeft = Math.floor((new Date(project.deadline).getTime() - new Date().getTime()) / oneDay);
            setStatus(status);
        }).catch((error) => {
            console.log(error);
        })
    }, [])


    const projectName = `Project name ${project}`;
    const projectMembers = [];
    return (
        <li>
            <div className="project">
                <div className="info">
                    <h4>{project.name}</h4>
                    <div>
                        {members.map((member) =>
                            <img key={member.id}
                            src={'/api/users/profilePicture/' + member.id} />
                        )}
                    </div>
                </div>

                <div className="project-progress">
                    <div className="info">
                        <span>{status.left} <br /> Tasks left</span>
                        <span>{status.completed} <br /> Tasks completed</span>
                        <span>{status.daysLeft} <br /> Days left</span>
                    </div>
                    <div className="skill-bar" style={{ "--width": status.percentage + '%' }}></div>
                </div>
            </div>
        </li>
    );
}
export default ProjectEntry;