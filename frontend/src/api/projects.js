import axios from 'axios';

const fetchProjects = async (rowCount, page) => {
    let projects = [];
    await axios.get('/api/projects/list/' + rowCount + '/' + page).then((response) => {
            projects = response.data;
    });
    return projects;
}

const fetchProjectMembers = async id => {
    let users = [];
    await axios.get('/api/projects/' + id + '/users').then((response) => {
        users = response.data;
    }).catch((error) => {
        console.log(error);
    })
    return users;
}

const fetchProjectTasks = async id => {
    let tasks = [];
    await axios.get('/api/tasks/project/' + id).then(response => {
        tasks = response.data;
    }).catch((error) => {
        console.log(error);
    });
    return tasks;
}

export {
    fetchProjects,
    fetchProjectMembers,
    fetchProjectTasks
}
