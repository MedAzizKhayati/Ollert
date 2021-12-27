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

export {
    fetchUser
}
