import React from 'react';
import '../style/ProjectsPage.css';
import Project from './Project';
import axios from 'axios';
import {Link} from 'react-router-dom';


const Projects = () => {
    const rowCount = 10;
    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        axios.get('/api/projects/list/' + rowCount + '/' + 1).then((response) => {
            setProjects(
                response.data.map(project =>
                    <Link className='projlink' to={"/projects/"+project.id}> <Project key={project.id} project={project} /> </Link>)
            );
        })
    }, []);

    return (
        <div className="container">
            <ul className="list-group">
                {projects}
            </ul>
        </div>

    )
}

export default Projects;