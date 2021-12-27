import React from 'react';
import '../style/Projects.scss';
import Project from './Project';
import {Link} from 'react-router-dom';
import { fetchProjects } from '../api/projects';
import { fetchUser } from '../api/users';
import { useNavigate } from 'react-router';

const Projects = (props) => {
    const rowCount = 10;
    const navigate = useNavigate();
    const [projects, setProjects] = React.useState([]);

    const [page, setPage] = React.useState(1);
    const [user, setUser] = React.useState(props.user);
    React.useEffect(async () => {
        fetchProjects(rowCount, page).then(projects => {
            setProjects(projects.map(project =>
                <Link className='projlink' to={"/projects/"+project.id}> <Project key={project.id} project={project} /> </Link>))
        });
        fetchUser().then(user => setUser(user));
    }, []);
    return (
        <div className="projects">
            {
                (user.role && user.role == 'CHEF')?
                <svg viewBox="0 0 16 16" onClick={() => navigate('/projects/create')}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                :null
            }

            <div className="container">
                <ul className="list-group">
                    {projects}
                </ul>
            </div>

        </div>
    )
}

export default Projects;