import React , { Component }from 'react';
import '../style/ProjectsPage.css';
import ProjectEntry from './ProjectEntry';

const Projects = () => {
    const rowCount = 5;
    const [allProjects, setAlProjects] = React.useState([]);
    React.useEffect( () => {
        setAlProjects(
            Array(rowCount).fill(0).map((element,i) => <ProjectEntry key = {i}/>)
        );
        }, []);

    return (
        <div className="Projects">
            {allProjects}
        </div>
    )
}

export default Projects;