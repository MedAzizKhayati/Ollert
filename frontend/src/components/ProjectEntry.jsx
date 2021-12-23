import React from 'react';
import {fetchProject} from '../api/projects';
import '../style/ProjectEntry.css';

const ProjectEntry = (props) => {

    const [project, setProject] = React.useState({});

    React.useEffect(async () => {
        let project = await fetchProject();
        setProject(project);
    }, [])

    const projectName = `Project name ${project}`;
    const projectMembers = [];
    return (
        <div className="projectEntry">
            <div className="left-container">
                <p>{projectName} </p>
                <div className="members-icons">

                </div>
            </div>

            <div className="right-container">
                <div className="project-info"></div>
                <div className="poregress-bar"></div>
            </div>

        </div>
    )
}
export default ProjectEntry;