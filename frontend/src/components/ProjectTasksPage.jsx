import React from "react";
import '../style/ProjectTasksPage.css';
import TaskCard from './TaskCard' ;
import { fetchProjectTasks } from "../api/Tasks";
import axios from 'axios';
import {useParams} from "react-router-dom";

const ProjectTasks = (props) => {
    const [project,setProject] = React.useState(useParams().id) ;
    //setProject(window.location.pathname.split("/").at(-1)) ;

    React.useEffect(() =>{
        setProject(window.location.pathname.split("/").at(-1));
    }, [useParams()]);
    
    const [title, setTtitle] = React.useState("Title");
    const [description, setDescription] = React.useState("Description");
    
    const [todo, setTodo] = React.useState([]);
    const [doing, setDoing] = React.useState([]);
    const [done, setDone] = React.useState([]);

    let createButton = <div></div>
    if(props.user["role"] === "CHEF")
        createButton = <a href={"/projects/"+ project + '/add'} class="btn btn-primary">Create task</a> ;
    
    React.useEffect(() => {
        axios.get('/api/tasks/project/todo/'+project).then((response) => {
            setTodo(
                response.data.map(task =>
                    <TaskCard key={task.id} title={task.title} 
                        description={task.description} iduser={task.id_user} color = "bg-danger" />)
            );
        });
        axios.get('/api/tasks/project/doing/'+project).then((response) => {
            setDoing(
                response.data.map(task =>
                    <TaskCard key={task.id} title={task.title} 
                        description={task.description} iduser={task.id_user} color = "bg-secondary" />)
            );
        }) ;
        axios.get('/api/tasks/project/done/'+project).then((response) => {
            setDone(
                response.data.map(task =>
                    <TaskCard key={task.id} title={task.title} 
                        description={task.description} iduser={task.id_user} color = "bg-success" />)
            );
        }) ;
        axios.get('/api/projects/'+project).then((response) => {
            setTtitle(response.data['name']) ;
            setDescription(response.data["description"]) ;
        }) ;
    }, [project]);

    return (
        <div className="cont">
            <div className="toppane">
                <div className="info">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                {createButton}
            </div>
            <div className="leftpane pane">
                <div className="TODO">
                    <h3>Todo</h3>
                    {todo}
                </div>
            </div>
            <div className="middlepane pane">
                <div className="Doing">
                    <h3>Doing</h3>
                    {doing}
                </div>
            </div>
            <div className="rightpane pane">
                <div className="Done">
                    <h3>Done</h3>
                    {done}
                </div>
            </div>
        </div>
    )
}

export default ProjectTasks;
