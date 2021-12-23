import React , { Component }from 'react';
import '../style/ProjectsPage.css';
import ProjectEntry from './ProjectEntry';

const Projects = () => {

    const rowCount = 5;

    const allProjects = [];

    for (let i = 0; i < rowCount; i++) {
        allProjects.push(<ProjectEntry key={i}/>);
    }
    return (
        <div className="Projects">
            {allProjects}
        </div>
    )
}

export default Projects;