import axios from 'axios';


const fetchProjectTasks = async (projectID) => {
    let tasks;
    await axios.get('/api/tasks/project/'+projectID).then((response) => {
        if (response.data) {
            tasks = response.data;
        }
    }).catch((err) => {
        tasks = (null);
    })
    return tasks;
}   

export {
    fetchProjectTasks
}
