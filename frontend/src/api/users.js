import axios from 'axios';
let user;

const fetchUser = async () => {
    if(user)
        return user;
    await axios.get('/api/users/getUser').then((response) => {
        if (response.data.user)
            user = (response.data.user);
    });
    return user;
}   

const queryUsers = async (query) => {
    let users = []
    await axios.get('/api/users/search/'+query).then((response) => {
        if (response.data)
            users = response.data;
    });
    return users;
}  

export {
    fetchUser,
    queryUsers
}
