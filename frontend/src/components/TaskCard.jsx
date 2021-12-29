import React from "react";
import '../style/TaskCard.scss';
import { useNavigate } from 'react-router-dom';
import { updateTaskState } from '../api/Tasks';
import { fetchUser } from '../api/users';
import axios from "axios";

const TaskCard = (props) => {
    const navigate = useNavigate();
    const STATES = ['TODO', 'DOING', 'DONE']
    const [title, setTitle] = React.useState(props.title);
    const [description, setDescription] = React.useState(props.description);
    const [user, setUser] = React.useState(null);
    const length = 100;
    const color = props.color;
    let image = <div></div>;
    if (props.iduser)
        image = <img src={'/api/users/profilePicture/' + props.iduser} />;
    if (!title)
        setTitle("Card title");
    if (!description)
        setDescription("With supporting text below as a natural lead-in to additional content.");

    const handleStateChange = (step) => {
        let state = STATES[step + STATES.indexOf(props.state)];
        updateTaskState({ id_task: props.id, state });
        window.location.reload();
    }

    const handleDelete = () => {
        console.log("hello");
        axios.delete('/api/tasks/' + props.id).then((response) =>
            window.location.reload()
        )
    }

    React.useEffect(async () => {
        setUser(await fetchUser())
    })

    let stateButtons = [];
    if (props.state != 'TODO')
        stateButtons.push(<i onClick={() => handleStateChange(-1)} class="bi bi-arrow-left-circle-fill"></i>)
    if (props.state != 'DONE')
        stateButtons.push(<i onClick={() => handleStateChange(1)} class="bi bi-arrow-right-circle-fill"></i>)


    return (
        <div class={"card text-white mb-3 " + color}>
            <div class="card-body">
                <h5 class="card-title">{title}</h5>
                {(user && user.role == 'CHEF')?
                    <div className="buttons">
                        <i class="bi bi-pencil-square" onClick={() => navigate('/projects/' + props.project + '/edit/' + props.id)}></i>
                        <i class="bi bi-trash" onClick={() => handleDelete()}></i>
                    </div>
                :null
                }

                <p class="card-text">{description.substring(0, length - 3) + "..."}</p>
                {stateButtons}
                {image}
            </div>
        </div>
    )
}
export default TaskCard;