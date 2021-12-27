import React from "react";
import '../style/TaskCard.css';


const TaskCard = (props) => {

    const [title, setTitle] = React.useState(props.title);
    const [description, setDescription] = React.useState(props.description);
    const color = props.color ;
    let image =  <div></div> ;
    if(props.iduser)
        image = <img src={'/api/users/profilePicture/' + props.iduser} /> ;
    if(!title)
        setTitle("Card title") ;
    if(!description)
        setDescription("With supporting text below as a natural lead-in to additional content.") ;
    return (
        <div class={"card text-white mb-3 "+color}>
            <div class="card-body">
                <h5 class="card-title">{title}</h5>
                <p class="card-text">{description}</p>
                <a href="#" class="btn btn-primary">Button</a>
                {image}
            </div>
        </div>
    )
}
export default TaskCard;