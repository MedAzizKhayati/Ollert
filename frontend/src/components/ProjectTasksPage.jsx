import React from "react";
import '../style/ProjectTasksPage.css';
import TaskCard from './TaskCard' ;
import { fetchProjectTasks } from "../api/Tasks";

const ProjectTasks = () => {
    const rowCount = 5;
    const [todo, setTodo] = React.useState([]);
    React.useEffect(() => {
        setTodo(
            Array(rowCount).fill(0).map((element, i) => <TaskCard key={i} color = "bg-danger" />)
        );
    }, []);
    const [doing, setDoing] = React.useState([]);
    React.useEffect(() => {
        setDoing(
            Array(rowCount).fill(0).map((element, i) => <TaskCard key={i} color = "bg-secondary" />)
        );
    }, []);
    const [done, setDone] = React.useState([]);
    React.useEffect(() => {
        setDone(
            Array(rowCount).fill(0).map((element, i) => <TaskCard key={i} color = "bg-success" />)
        );
    }, []);

    return (
        <div className="cont">
            <div className="toppane">
                <h1>Title</h1>
            </div>
            <div className="leftpane pane">
                <div className="TODO">
                    {todo}
                </div>
            </div>
            <div className="middlepane pane">
                <div className="Doing">
                    {doing}
                </div>
            </div>
            <div className="rightpane pane">
                <div className="Done">
                    {done}
                </div>
            </div>
        </div>
    )
}

export default ProjectTasks;
