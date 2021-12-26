import React from "react";
import '../style/TaskCard.css';


const TaskCard = (props) => {

    const [project, setProject] = React.useState(props.project);

    // const taskName = `Project name ${project}`;
    // const taskUser = '';
    const color = props.color ;
    return (
        <div class={"card text-white mb-3 "+color}>
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <a href="#" class="btn btn-primary">Button</a>
            </div>
        </div>
    )
}
export default TaskCard;