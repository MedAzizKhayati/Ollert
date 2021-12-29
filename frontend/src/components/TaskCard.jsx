import React from "react";
import '../style/TaskCard.scss';


const TaskCard = (props) => {
    const [title, setTitle] = React.useState(props.title);
    const [description, setDescription] = React.useState(props.description);
    const length = 100;
    const color = props.color;
    let image = <div></div>;
    if (props.iduser)
        image = <img src={'/api/users/profilePicture/' + props.iduser} />;
    if (!title)
        setTitle("Card title");
    if (!description)
        setDescription("With supporting text below as a natural lead-in to additional content.");
    return (
        <div class={"card text-white mb-3 " + color}>
            <div class="card-body">
                <h5 class="card-title">{title}</h5>
                <div className="buttons">
                    <i class="bi bi-pencil-square"></i>
                    <i class="bi bi-trash"></i>
                </div>
                <p class="card-text">{description.substring(0, length - 3) + "..."}</p>
                <i class="bi bi-arrow-left-circle-fill"></i>
                <i class="bi bi-arrow-right-circle-fill"></i>
                {image}
            </div>
        </div>
    )
}
export default TaskCard;