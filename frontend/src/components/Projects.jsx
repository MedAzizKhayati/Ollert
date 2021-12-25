import React from 'react';
import '../style/ProjectsPage.css';
import Project from './Project';
import axios from 'axios';


const Projects = () => {
    const rowCount = 10;
    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        axios.get('/api/projects/list/' + rowCount + '/' + 1).then((response) => {
            setProjects(
                response.data.map(project =>
                    <Project key={project.id} project={project} />)
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