import axios from 'axios';


const fetchProjectTasks = async (projectID) => {
    let todo, doing , done;
    await axios.get('/api/tasks/project/todo/'+projectID).then((response) => {
        if (response.data) {
            todo = response.data;
        }
    }).catch((err) => {
        todo = (null);
    })
    await axios.get('/api/tasks/project/doing/'+projectID).then((response) => {
        if (response.data) {
            doing = response.data;
        }
    }).catch((err) => {
        doing = (null);
    })
    await axios.get('/api/tasks/project/done/'+projectID).then((response) => {
        if (response.data) {
            done = response.data;
        }
    }).catch((err) => {
        done = (null);
    })
    return [todo,doing,done];
}   

const updateTaskState = (state) => {
    let response;
    axios.put('/api/tasks/updatestate', state).then((res) => {
        response = response;
    })
    return response;
}

export {
    fetchProjectTasks,
    updateTaskState
}
